import "dotenv/config";

const parseInteger = (value, fallback) => {
    const parsed = Number.parseInt(value ?? "", 10);
    return Number.isNaN(parsed) ? fallback : parsed;
};

const parseFloatValue = (value, fallback) => {
    const parsed = Number.parseFloat(value ?? "");
    return Number.isNaN(parsed) ? fallback : parsed;
};

const parseBoolean = (value, fallback) => {
    if (value === undefined || value === null) {
        return fallback;
    }

    const normalized = String(value).trim().toLowerCase();
    if (normalized === "true") return true;
    if (normalized === "false") return false;
    return fallback;
};

const parseAllowedOrigins = (value) =>
    value
        .split(",")
        .map((origin) => origin.trim())
        .filter(Boolean);

const nodeEnv = process.env.NODE_ENV ?? "development";

if (nodeEnv === "production") {
    const requiredKeys = [
        "DATABASE_URL",
        "JWT_SECRET",
        "ALLOWED_ORIGINS",
        "REDIS_URL",
    ];
    for (const key of requiredKeys) {
        if (!process.env[key]) {
            throw new Error(`Missing required environment variable: ${key}`);
        }
    }
}

export const config = Object.freeze({
    nodeEnv,
    port: parseInteger(process.env.PORT, 8000),
    databaseUrl: process.env.DATABASE_URL ?? "",
    allowedOrigins: parseAllowedOrigins(process.env.ALLOWED_ORIGINS ?? ""),

    gracefulShutdownTimeoutMs: parseInteger(
        process.env.GRACEFUL_SHUTDOWN_TIMEOUT_MS,
        15_000,
    ),

    redisUrl: process.env.REDIS_URL ?? "",
    rateLimitMaxRequests: parseInteger(
        process.env.RATE_LIMIT_MAX_REQUESTS,
        100,
    ),
    rateLimitWindowMs: parseInteger(
        process.env.RATE_LIMIT_WINDOW_MS,
        15 * 60 * 1000,
    ),

    logLevel: process.env.LOG_LEVEL ?? (nodeEnv === "production" ? "info" : "debug"),
});