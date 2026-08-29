import { getPrisma } from "../../config/database.js";

const NOTE_SELECT = {
    id: true,
    title: true,
    content: true,
    userId: true,
    createdAt: true,
    updatedAt: true,
};

// Find a note by userId + title (for duplicate title check)
export const findNoteByUserIdAndTitle = async ({ userId, title }) => {
    const db = getPrisma();
    return db.note.findUnique({
        where: { userId_title: { userId, title } },
        select: { id: true },
    });
};

// Create a new note
export const createNote = async ({ userId, title, content }) => {
    const db = getPrisma();
    return db.note.create({
        data: { userId, title, content },
        select: NOTE_SELECT,
    });
};

// Find all notes (admin view)
export const findAllNotes = async () => {
    const db = getPrisma();
    return db.note.findMany({
        select: NOTE_SELECT,
        orderBy: { createdAt: "desc" },
    });
};

// Find all notes belonging to a specific user
export const findNotesByUser = async (userId) => {
    const db = getPrisma();
    return db.note.findMany({
        where: { userId },
        select: NOTE_SELECT,
        orderBy: { createdAt: "desc" },
    });
};

// Find a single note by its ID
export const findNoteById = async (noteId) => {
    const db = getPrisma();
    return db.note.findUnique({
        where: { id: noteId },
        select: NOTE_SELECT,
    });
};

// Update a note's title and/or content (only provided fields)
export const updateNote = async (noteId, { title, content }) => {
    const db = getPrisma();
    return db.note.update({
        where: { id: noteId },
        data: {
            ...(title !== undefined ? { title } : {}),
            ...(content !== undefined ? { content } : {}),
        },
        select: NOTE_SELECT,
    });
};

// Delete a note by its ID
export const deleteNote = async (noteId) => {
    const db = getPrisma();
    return db.note.delete({
        where: { id: noteId },
        select: { id: true },
    });
};
