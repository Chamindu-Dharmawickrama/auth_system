import { Router } from "express";
import redis from "../../config/redis.js";
import { createRateLimiter } from "../../middlewares/rateLimiter.js";
import logger from "../../config/logger.js";
import { authenticateUser, requireRole } from "../../middlewares/authenticate.js";
import { validate } from "../../middlewares/validate.js";
import { catchAsync } from "../../utils/catchAsync.js";
import {
    createNoteSchema,
    noteIdParamSchema,
    updateNoteSchema,
} from "./notes.validator.js";
import {
    createNoteController,
    getNotesController,
    getNoteByIdController,
    updateNoteController,
    deleteNoteController,
} from "./notes.controller.js";
import { getUserNotesController } from "./notes.controller.js";

const notesRouter = Router();

const createNoteLimiter = createRateLimiter({
    redis,
    limit: 20,
    windowMs: 60_000,
    prefix: "notes-create",
    errorMessage: "Too many note creation requests. Try again later.",
    keyGenerator: (req) => req.user?.id ?? req.ip,
    fallbackBehavior: "block",
    onRedisError: (error) =>
        logger.warn("Notes create rate limiter Redis error — blocking for safety", {
            message: error.message,
        }),
});

const getNotesLimiter = createRateLimiter({
    redis,
    limit: 100,
    windowMs: 60_000,
    prefix: "notes-list",
    errorMessage: "Too many note list requests. Try again later.",
    keyGenerator: (req) => req.user?.id ?? req.ip,
    fallbackBehavior: "block",
    onRedisError: (error) =>
        logger.warn("Notes list rate limiter Redis error — blocking for safety", {
            message: error.message,
        }),
});

const getNoteByIdLimiter = createRateLimiter({
    redis,
    limit: 100,
    windowMs: 60_000,
    prefix: "notes-get",
    errorMessage: "Too many note fetch requests. Try again later.",
    keyGenerator: (req) => req.user?.id ?? req.ip,
    fallbackBehavior: "block",
    onRedisError: (error) =>
        logger.warn("Notes get rate limiter Redis error — blocking for safety", {
            message: error.message,
        }),
});

const updateNoteLimiter = createRateLimiter({
    redis,
    limit: 20,
    windowMs: 60_000,
    prefix: "notes-update",
    errorMessage: "Too many note update requests. Try again later.",
    keyGenerator: (req) => req.user?.id ?? req.ip,
    fallbackBehavior: "block",
    onRedisError: (error) =>
        logger.warn("Notes update rate limiter Redis error — blocking for safety", {
            message: error.message,
        }),
});

const deleteNoteLimiter = createRateLimiter({
    redis,
    limit: 10,
    windowMs: 60_000,
    prefix: "notes-delete",
    errorMessage: "Too many note deletion requests. Try again later.",
    keyGenerator: (req) => req.user?.id ?? req.ip,
    fallbackBehavior: "block",
    onRedisError: (error) =>
        logger.warn("Notes delete rate limiter Redis error — blocking for safety", {
            message: error.message,
        }),
});

// POST /notes — create a note
notesRouter.post(
    "/",
    authenticateUser,
    createNoteLimiter,
    validate(createNoteSchema),
    catchAsync(createNoteController),
);

// GET /notes — list all notes (ADMIN)
notesRouter.get("/",
    authenticateUser,
    requireRole("ADMIN"),
    getNotesLimiter,
    catchAsync(getNotesController)
);

// GET /notes/my-notes — list all notes of a specific user
notesRouter.get(
    "/my-notes",
    authenticateUser,
    getNotesLimiter,
    catchAsync(getUserNotesController)
);

// GET /notes/:noteId — get a single note
notesRouter.get(
    "/:noteId",
    authenticateUser,
    getNoteByIdLimiter,
    validate(noteIdParamSchema),
    catchAsync(getNoteByIdController),
);

// PATCH /notes/:noteId — update a note (only the owner can update)
notesRouter.patch(
    "/:noteId",
    authenticateUser,
    updateNoteLimiter,
    validate(updateNoteSchema),
    catchAsync(updateNoteController),
);

// DELETE /notes/:noteId — delete a note (owner or ADMIN)
notesRouter.delete(
    "/:noteId",
    authenticateUser,
    deleteNoteLimiter,
    validate(noteIdParamSchema),
    catchAsync(deleteNoteController),
);

export default notesRouter;
