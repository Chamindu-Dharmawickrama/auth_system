import crypto from "node:crypto";
import express from "express";
import helmet from "helmet";
import cors from "cors";
import compression from "compression";
import { config } from "./config/env.js";
import { isDatabaseHealthy } from "./config/database.js";
import { logger } from "./config/logger.js";
import { isRedisHealthy } from "./config/redis.js";

const app = express();

if (config.nodeEnv === "production") {
    app.set("trust proxy", 1);
}

// Assigns a unique ID to every request for end-to-end tracing across services.
app.use((req, res, next) => {
    req.id = req.headers["x-request-id"] || crypto.randomUUID();
    res.setHeader("X-Request-Id", req.id);
    next();
});

app.use(helmet());

app.use(
    cors({
        origin: config.allowedOrigins,
        credentials: true, // Allow cookies in cross-origin requests (needed for refresh tokens)
        methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
        allowedHeaders: ["Content-Type", "Authorization", "X-Requested-With"],
    }),
);

// Compresses response bodies using gzip/deflate. Reduces bandwidth usage by
// 60-80% for JSON/text responses. Browsers handle decompression transparently.
app.use(compression());

// Limit request body size to 10KB to prevent payload-based DoS attacks.
// urlencoded with extended:true supports rich objects and arrays via qs library.
app.use(express.json({ limit: "10kb" }));
app.use(express.urlencoded({ extended: true, limit: "10kb" }));

// Logs every completed HTTP request 
app.use((req, res, next) => {
    const start = Date.now();

    res.on("finish", () => {
        logger.http(`${req.method} ${req.originalUrl}`, {
            statusCode: res.statusCode,
            durationMs: Date.now() - start,
            requestId: req.id,
            ip: req.ip,
            userAgent: req.get("user-agent"),
        });
    });

    next();
});

// Health check
app.get("/health", async (req, res) => {
    const [dbHealthy, redisHealthy] = await Promise.all([
        isDatabaseHealthy(),
        isRedisHealthy(),
    ]);

    const allHealthy = dbHealthy && redisHealthy;
    const status = allHealthy ? "ok" : "degraded";
    const statusCode = allHealthy ? 200 : 503;

    res.status(statusCode).json({
        status,
        timestamp: new Date().toISOString(),
        uptime: Math.floor(process.uptime()),
        checks: {
            database: dbHealthy ? "connected" : "disconnected",
            redis: redisHealthy ? "connected" : "disconnected",
        },
    });
});

// 404 handler
app.use((req, res) => {
    res.status(404).json({
        error: "Not Found",
        message: `Cannot ${req.method} ${req.originalUrl}`,
        requestId: req.id,
    });
});

// Global Error Handler
// Security: Never exposes stack traces in production. Distinguishes client
// errors (4xx → warn level) from server errors (5xx → error level with stack).
app.use((err, req, res, _next) => {
    const statusCode = err.statusCode || err.status || 500;
    const isServerError = statusCode >= 500;

    if (isServerError) {
        logger.error(`Unhandled error: ${err.message}`, {
            stack: err.stack,
            requestId: req.id,
            method: req.method,
            url: req.originalUrl,
        });
    } else {
        logger.warn(`Client error: ${err.message}`, {
            statusCode,
            requestId: req.id,
        });
    }

    res.status(statusCode).json({
        error: isServerError ? "Internal Server Error" : err.message,
        // Only expose stack traces in non-production environments for debugging
        ...(config.nodeEnv !== "production" && { stack: err.stack }),
        requestId: req.id,
    });
});

export default app;