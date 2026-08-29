import { z } from "zod";

// Reusable param schema for routes that include :noteId
const noteIdParam = z.object({
    noteId: z.string().min(1, "Note ID is required"),
});

// POST /notes — body only
export const createNoteSchema = z.object({
    body: z.object({
        title: z
            .string()
            .trim()
            .min(1, "Title is required")
            .max(255, "Title must be at most 255 characters"),
        content: z
            .string()
            .trim()
            .min(1, "Content is required")
            .max(10000, "Content must be at most 10,000 characters"),
    }),
});

// GET /notes/:noteId and DELETE /notes/:noteId — params only
export const noteIdParamSchema = z.object({
    params: noteIdParam,
});

// PATCH /notes/:noteId — params + partial body (at least one field required)
export const updateNoteSchema = z.object({
    params: noteIdParam,
    body: z
        .object({
            title: z
                .string()
                .trim()
                .min(1, "Title cannot be empty")
                .max(255, "Title must be at most 255 characters")
                .optional(),
            content: z
                .string()
                .trim()
                .min(1, "Content cannot be empty")
                .max(10000, "Content must be at most 10,000 characters")
                .optional(),
        })
        .refine(
            (data) => data.title !== undefined || data.content !== undefined,
            "At least one field (title or content) must be provided.",
        ),
});
