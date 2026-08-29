import { AppError } from "../../utils/appError.js";
import { toNoteDTO } from "./notes.dto.js";
import { createNote, deleteNote, findAllNotes, findNoteById, findNoteByUserIdAndTitle, findNotesByUser, updateNote } from "./notes.repository.js";

// create note service
export const createNoteService = async ({ userId, title, content }) => {
   
    const existing = await findNoteByUserIdAndTitle({ userId, title });
    if (existing) {
        throw new AppError(
            `A note with the title "${title}" already exists. Please choose a different title.`,
            409,
        );
    }

    const note = await createNote({ userId, title, content });

    return toNoteDTO(note);
};


// get all notes service (ADMIN)
export const getNotesService = async () => {

    const notes = await findAllNotes()
           
    return notes.map(toNoteDTO);
};


// get notes by userId service
export const getUserNotesService = async (userId) => {

    const notes = await findNotesByUser(userId);

    return notes.map(toNoteDTO);
};


// get note by noteId service
export const getNoteByIdService = async ({
    noteId,
    requesterId,
    requesterRole,
}) => {
    const note = await findNoteById(noteId);

    if (!note) {
        throw new AppError("Note not found.", 404);
    }

    if (requesterRole !== "ADMIN" && note.userId !== requesterId) {
        throw new AppError(
            "You do not have permission to access this resource.",
            403,
        );
    }

    return toNoteDTO(note);
};


// update note service
export const updateNoteService = async ({
    noteId,
    requesterId,
    data,
}) => {
    const note = await findNoteById(noteId);

    if (!note) {
        throw new AppError("Note not found.", 404);
    }

    // Ownership check applies to ALL roles — even ADMIN cannot edit another user's note.
    if (note.userId !== requesterId) {
        throw new AppError(
            "You do not have permission to update this note.",
            403,
        );
    }

    const updatedNote = await updateNote(noteId, data);
    return toNoteDTO(updatedNote);
};


// delete note service
export const deleteNoteService = async ({
    noteId,
    requesterId,
    requesterRole,
}) => {
    const note = await findNoteById(noteId);

    if (!note) {
        throw new AppError("Note not found.", 404);
    }

    if (requesterRole !== "ADMIN" && note.userId !== requesterId) {
        throw new AppError(
            "You do not have permission to delete this note.",
            403,
        );
    }

    await deleteNote(noteId);
};