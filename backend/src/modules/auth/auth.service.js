import { AppError } from "../../utils/appError.js";
import { findUser, findUserForLogin, createUser, storeRefreshToken, findRefreshToken, revokeRefreshTokenFamily, revokeRefreshToken, revokeAllUserRefreshTokens } from "./auth.repository.js";
import { toLoginResponseDTO, toRefreshResponseDTO, toRegistrationResponseDTO } from "./auth.dto.js";
import bcrypt from "bcrypt";
import { v4 as uuidv4 } from 'uuid';
import { decodeToken, hashRefreshToken, signAccessToken, signRefreshToken, verifyRefreshToken } from "../../utils/tokens.js";
import { config } from "../../config/env.js";
import { addToBlocklist, setUserInvalidateBefore } from "../../utils/tokenBlocklist.js";

const DUMMY_HASH = '$2b$12$IgJ8jdQ5K5KmOFb1JXfkXOo2qKFQxB1e5c.L9Kn8dGdRsWQyVhDOq';

export const loginService = async ({ username, password }) => {

    const user = await findUserForLogin(username);

    // TIMING ATTACK PREVENTION:
    const hashToCompare = user ? user.password : DUMMY_HASH;
    const passwordValid = await bcrypt.compare(password, hashToCompare);

    if (!user || !passwordValid) {
        throw new AppError("Invalid username or password.", 401)
    }

    // issue tokens 
    // A new family UUID groups all refresh token rotations from this login.
    // If a rotated-out token is reused, we revoke the entire family.
    const family = uuidv4();
    const accessToken = signAccessToken(user);
    const refreshToken = signRefreshToken(user, family);

    // Store the hashed refresh token in the DB for revocation capability.
    const hashedRefreshToken = hashRefreshToken(refreshToken);
    const expiresAt = new Date(Date.now() + config.refreshTokenExpiryInMs);
    await storeRefreshToken(user.id, hashedRefreshToken, family, expiresAt);

    return toLoginResponseDTO(user, accessToken, refreshToken);
};


export const registerService = async ({ username, email, password }) => {

    const existingUser = await findUser({ username, email });

    if (existingUser) {
        throw new AppError("Username or email already in use.", 409);
    }

    const SALT_ROUNDS = 12;
    const hashedPassword = await bcrypt.hash(password, SALT_ROUNDS);

    const user = await createUser({ username, email, password: hashedPassword });

    return toRegistrationResponseDTO(user);
};


export const refreshTokenService = async ({ rawToken }) => {

    // Hash the incoming token - for db search 
    const incomingHash = hashRefreshToken(rawToken);

    const storedToken = await findRefreshToken(incomingHash);

    // No DB record for this hash — token is unknown or was never issued.
    if (!storedToken) {
        throw new AppError("Invalid or unrecognized refresh token.", 401);
    }

    // REUSE ATTACK: if the token is already revoked, a previously-rotated token
    // is being replayed. Revoke the entire family to invalidate all derived tokens.
    if (storedToken.revoked) {
        await revokeRefreshTokenFamily(storedToken.family);
        throw new AppError("Refresh token reuse detected. Please log in again.", 401);
    }

    // Check server-side expiry (independent of JWT claim — allows forced expiration).
    if (storedToken.expiresAt < new Date()) {
        await revokeRefreshToken(storedToken.id);
        throw new AppError("Refresh token has expired. Please log in again.", 401);
    }

    // verify the refresh token signature
    let payload;
    try {
        payload = verifyRefreshToken(rawToken);
    } catch (error) {
        await revokeRefreshToken(storedToken.id)
        throw new AppError("Invalid refresh token. Please log in again.", 401);
    }

    // Revoke the consumed token — it must never be used again after this point
    await revokeRefreshToken(storedToken.id)

    // Re-fetch the user from DB so the new access token always carries a
    // fresh role — avoids propagating stale roles through rotation chains.
    const freshUser = await findUserForLogin(payload.username);
    if (!freshUser) {
        throw new AppError("User account no longer exists.", 401);
    }

    // Issue a rotated token pair. The new refresh token inherits the same family
    const newAccessToken = signAccessToken(freshUser);
    const newRefreshToken = signRefreshToken(freshUser, storedToken.family);

    // store new rotated refresh token
    const hashedRefreshToken = hashRefreshToken(newRefreshToken);
    const expiresAt = new Date(Date.now() + config.refreshTokenExpiryInMs);
    await storeRefreshToken(storedToken.userId, hashedRefreshToken, storedToken.family, expiresAt);

    return toRefreshResponseDTO(newAccessToken, newRefreshToken);
}


export const logoutService = async ({ rawToken, accessToken }) => {

    const incomingHash = hashRefreshToken(rawToken);
    const storedToken = await findRefreshToken(incomingHash);

    // If the token is not in the DB (already expired, revoked, or forged),
    if (!storedToken || storedToken.revoked) {
        await _blocklistAccessToken(accessToken);
        return;
    }

    // Revoke the entire family — this invalidates all refresh tokens issued
    // from this login session (across rotations), not just the current one.
    await revokeRefreshTokenFamily(storedToken.family);

    // blocklist the current access token
    await _blocklistAccessToken(accessToken);
};


export const logoutAllService = async ({ userId, accessToken }) => {
    // kill all refresh sessions ( revoke by user id, so all the refresh token's family will be revoked)
    await revokeAllUserRefreshTokens(userId);

    // immediately invalidate all outstanding access tokens
    await setUserInvalidateBefore(userId);

    // blocklist the caller's own access token
    await _blocklistAccessToken(accessToken);
}


// Add an access token to the Redis blocklist
async function _blocklistAccessToken(accessToken) {
    if (!accessToken) return;
    try {
        const payload = decodeToken(accessToken);
        if (!payload?.exp) return; // get expire time (sec)
        const remainingMs = payload.exp * 1000 - Date.now();
        await addToBlocklist(accessToken, remainingMs);
    } catch (error) {
        throw new AppError("Invalid access token.", 401);
    }
}