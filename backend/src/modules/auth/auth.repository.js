import { getPrisma } from "../../config/database.js";

// find user by username or email
export const findUser = async ({ username, email }) => {
    const db = getPrisma();
    return db.user.findFirst({
        where: {
            OR: [
                { username: username },
                { email: email },
            ],
        },
        select: {
            id: true,
        }
    })
}

// create user
export const createUser = async ({ username, email, password }) => {
    const db = getPrisma();
    return db.user.create({
        data: {
            username,
            email,
            password,
        },
    })
}

// find user by username for login
export const findUserForLogin = async (username) => {
    const db = getPrisma();
    return db.user.findUnique({
        where: { username },
        select: {
            id: true,
            username: true,
            email: true,
            role: true,
            password: true,
            createdAt: true,
            updatedAt: true,
        }
    })
}

// store the refresh token 
export const storeRefreshToken = async (userId, tokenHash, family, expiresAt) => {
    const db = getPrisma();
    return db.refreshToken.create({
        data: {
            tokenHash,
            userId,
            family,
            expiresAt,
            revoked: false,
        }
    })
}

// find the stored refresh token 
export const findRefreshToken = async (tokenHash) => {
    const db = getPrisma();
    return db.refreshToken.findUnique({
        where: {
            tokenHash
        },
        select: {
            id: true,
            userId: true,
            family: true,
            expiresAt: true,
            revoked: true,
        }
    })
}

// revoke every token in a family
export const revokeRefreshTokenFamily = async (family) => {
    const db = getPrisma();
    return db.refreshToken.updateMany({
        where: { family },
        data: { revoked: true }
    })
}

// revoke a single refresh token by its DB id (used during normal rotation)
export const revokeRefreshToken = async (id) => {
    const db = getPrisma();
    return db.refreshToken.update({
        where: { id },
        data: { revoked: true },
    });
}

// Revoke ALL non-revoked refresh tokens for a user (logout-all / password reset) 
export const revokeAllUserRefreshTokens = async (userId) => {
    const db = getPrisma();
    return db.refreshToken.updateMany({
        where: { userId, revoked: false },
        data: { revoked: true },
    });
};


