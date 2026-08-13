import { Router } from "express";
import redis from "../../config/redis.js";
import { createRateLimiter } from "../../middlewares/rateLimiter.js";
import logger from "../../config/logger.js";
import { validate } from "../../middlewares/validate.js";
import { loginSchema, registerSchema } from "./auth.validator.js";
import { catchAsync } from "../../utils/catchAsync.js";
import { loginController, logoutAllController, logoutController, refreshController, registerController } from "./auth.controller.js";
import { authenticateUser } from "../../middlewares/authenticate.js";

const authRouter = Router();

const loginLimiter = createRateLimiter({
    redis,
    limit: 3,
    windowMs: 60_000,
    prefix: "login",
    errorMessage: "Too many login attempts. Try again later.",
    keyGenerator: (req) => req.user?.id ?? req.ip,
    fallbackBehavior: "block",
    onRedisError: (error) => {
        logger.warn(
            "Login rate limiter Redis error - blocking request for safety",
            {
                message: error.message,
            },
        );
    },
});

const refreshLimiter = createRateLimiter({
    redis,
    limit: 10,
    windowMs: 60_000,
    prefix: "refresh",
    errorMessage: "Too many token refresh attempts. Try again later.",
    keyGenerator: (req) => req.user?.id ?? req.ip,
    fallbackBehavior: "block",
    onRedisError: (error) => {
        logger.warn(
            "Refresh rate limiter Redis error - blocking request for safety",
            {
                message: error.message,
            },
        );
    },
});

const registerLimiter = createRateLimiter({
    redis,
    limit: 5,
    windowMs: 60_000,
    prefix: "register",
    errorMessage: "Too many register attempts. Try again later.",
    keyGenerator: (req) => req.user?.id ?? req.ip,
    fallbackBehavior: "block",
    onRedisError: (error) => {
        logger.warn(
            "Login rate limiter Redis error - blocking request for safety",
            {
                message: error.message,
            },
        );
    },
});

const logoutLimiter = createRateLimiter({
    redis,
    limit: 20,
    windowMs: 60_000,
    prefix: "logout",
    errorMessage: "Too many logout attempts. Try again later.",
    keyGenerator: (req) => req.user?.id ?? req.ip,
    fallbackBehavior: "block",
    onRedisError: (error) => {
        logger.warn(
            "Logout rate limiter Redis error - blocking request for safety",
            {
                message: error.message,
            },
        );
    },
});

const logoutAllLimiter = createRateLimiter({
    redis,
    limit: 5,
    windowMs: 60_000,
    prefix: 'logout-all',
    errorMessage: 'Too many logout-all attempts. Try again later.',
    // req.user is populated by authenticateUser, which runs before this limiter
    keyGenerator: (req) => req.user?.id ?? req.ip,
    fallbackBehavior: 'block',
    onRedisError: (error) =>
        logger.warn('Logout-all rate limiter Redis error — blocking for safety', { message: error.message }),
});

// POST /auth/login
authRouter.post("/login", loginLimiter, validate(loginSchema), catchAsync(loginController));

// POST /auth/register
authRouter.post("/register", registerLimiter, validate(registerSchema), catchAsync(registerController));

// POST /auth/refresh
authRouter.post("/refresh", refreshLimiter, catchAsync(refreshController));

// POST /auth/logout
authRouter.post("/logout", logoutLimiter, catchAsync(logoutController));

// POST /auth/logout-all  — requires a valid access token
authRouter.post('/logout-all',
    authenticateUser,
    logoutAllLimiter,
    catchAsync(logoutAllController),
);

export default authRouter;