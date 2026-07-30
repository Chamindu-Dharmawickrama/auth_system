import { config } from "./env.js";

const LOG_LEVELS = { error: 0, warn: 1, info: 2, http: 3, debug: 4 };

const currentLevel = LOG_LEVELS[config.logLevel] ?? LOG_LEVELS.info;

/**
 * Formats a log entry as JSON (production) or human-readable (development).
 * @param {"error"|"warn"|"info"|"http"|"debug"} level
 * @param {string} message
 * @param {Record<string, unknown>} [meta]
 * @returns {string}
 */
const formatMessage = (level, message, meta = {}) => {
    const entry = {
        timestamp: new Date().toISOString(),
        level,
        message,
        ...(Object.keys(meta).length > 0 && { meta }),
    };

    return config.nodeEnv === "production"
        ? JSON.stringify(entry)
        : `${entry.timestamp} [${level.toUpperCase().padEnd(5)}] ${message}${
              Object.keys(meta).length > 0
                  ? ` ${JSON.stringify(meta)}`
                  : ""
          }`;
};


export const logger = Object.freeze({
    error: (msg, meta) =>
        LOG_LEVELS.error <= currentLevel &&
        console.error(formatMessage("error", msg, meta)),
    warn: (msg, meta) =>
        LOG_LEVELS.warn <= currentLevel &&
        console.warn(formatMessage("warn", msg, meta)),
    info: (msg, meta) =>
        LOG_LEVELS.info <= currentLevel &&
        console.info(formatMessage("info", msg, meta)),
    http: (msg, meta) =>
        LOG_LEVELS.http <= currentLevel &&
        console.log(formatMessage("http", msg, meta)),
    debug: (msg, meta) =>
        LOG_LEVELS.debug <= currentLevel &&
        console.debug(formatMessage("debug", msg, meta)),
});
