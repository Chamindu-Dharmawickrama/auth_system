import { AppError } from "../../utils/appError.js";
import { findUser, findUserForLogin, createUser, storeRefreshToken, findRefreshToken, revokeRefreshTokenFamily, revokeRefreshToken, revokeAllUserRefreshTokens, lockUserUntil, incrementFailedAttempts, resetLoginTracking, invalidateUserPasswordResets, createPasswordReset, findPasswordReset, markPasswordResetUsed, updateUserPassword, findUserByEmail } from "./auth.repository.js";
import { toLoginResponseDTO, toRefreshResponseDTO, toRegistrationResponseDTO } from "./auth.dto.js";
import bcrypt from "bcrypt";
import crypto from 'crypto';
import { v4 as uuidv4 } from 'uuid';
import { decodeToken, hashRefreshToken, signAccessToken, signRefreshToken, verifyRefreshToken } from "../../utils/tokens.js";
import { config } from "../../config/env.js";
import { addToBlocklist, setUserInvalidateBefore } from "../../utils/tokenBlocklist.js";

const DUMMY_HASH = '$2b$12$IgJ8jdQ5K5KmOFb1JXfkXOo2qKFQxB1e5c.L9Kn8dGdRsWQyVhDOq';
const MAX_FAILED_ATTEMPTS = config.maxLoginAttempts;
const LOCKOUT_DURATION_MS = config.lockoutDurationMs;

export const loginService = async ({ username, password }) => {

    const user = await findUserForLogin(username);

    // check account status
    if (user?.lockedUntil && user.lockedUntil > new Date()) {
        const remainingMinutes = Math.ceil((user.lockedUntil - Date.now()) / 60_000);
        throw new AppError(
            `Account temporarily locked. Try again in ${remainingMinutes} minute(s).`,
            429,
        );
    }

    // TIMING ATTACK PREVENTION:
    const hashToCompare = user ? user.password : DUMMY_HASH;
    const passwordValid = await bcrypt.compare(password, hashToCompare);

    if (!user || !passwordValid) {
        if (user && !passwordValid) {
            const newFailedAttemptCount = (user?.failedAttempts || 0) + 1;
            if (newFailedAttemptCount > MAX_FAILED_ATTEMPTS) {
                const lockedUntil = new Date(Date.now() + LOCKOUT_DURATION_MS);
                await lockUserUntil(user.id, lockedUntil);
                throw new AppError(
                    `Account locked after ${MAX_FAILED_ATTEMPTS} failed attempts. ` +
                    `Try again in ${LOCKOUT_DURATION_MS / 60_000} minute(s).`,
                    429,
                );
            }

            await incrementFailedAttempts(user.id);
        }
        throw new AppError("Invalid username or password.", 401)
    }

    if (!user.isActive) {
        throw new AppError('Your account has been suspended. Please contact support.', 403);
    }

    if (user.failedAttempts > 0 || user.lockedUntil !== null) {
        await resetLoginTracking(user.id);
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


export const forgotPasswordService = async ({ email }) => {
    const user = await findUserByEmail(email);
    if (!user) return;

    // Only one active reset token per user at a time
    await invalidateUserPasswordResets(user.id);

    const rawToken = crypto.randomBytes(32).toString('hex');
    const tokenHash = hashRefreshToken(rawToken);
    const expiresAt = new Date(Date.now() + config.passwordResetExpiryInMs);

    await createPasswordReset(user.id, tokenHash, expiresAt);

    // create a reset url with the raw token
    const resetUrl = `${config.allowedOrigins[0]}/reset-password?token=${rawToken}`;

    // TODO: send email with reset url

    console.log("[PASSWORD RESET URL]: ", resetUrl);
}


export const resetPasswordService = async ({ token, newPassword }) => {
    const tokenHash = hashRefreshToken(token);
    const storedReset = await findPasswordReset(tokenHash);

    if (!storedReset || storedReset.used) {
        throw new AppError('Invalid or already-used password reset token.', 400);
    }

    if (storedReset.expiresAt < new Date()) {
        await markPasswordResetUsed(storedReset.id); // cleanup expired token
        throw new AppError('Password reset token has expired. Please request a new one.', 400);
    }

    // Consume the token FIRST — prevents replay in concurrent requests
    await markPasswordResetUsed(storedReset.id);

    // save the new password 
    const SALT_ROUNDS = 12;
    const hashedPassword = await bcrypt.hash(newPassword, SALT_ROUNDS);
    await updateUserPassword(storedReset.userId, hashedPassword);

    // kill all refresh sessions ( revoke by user id, so all the refresh token's family will be revoked)
    await revokeAllUserRefreshTokens(storedReset.userId);

    // immediately invalidate all outstanding access tokens
    await setUserInvalidateBefore(storedReset.userId);

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