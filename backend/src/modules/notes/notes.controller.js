import { sendSuccess } from "../../utils/apiResponse.js";
import { getUserNotesService } from "./notes.service.js";
import {
    createNoteService,
    getNotesService,
    getNoteByIdService,
    updateNoteService,
    deleteNoteService,
} from "./notes.service.js";


// POST /notes
export const createNoteController = async (req, res) => {
    const { title, content } = req.body;
    const { id: userId } = req.user;

    const note = await createNoteService({ userId, title, content });

    return sendSuccess(res, {
        statusCode: 201,
        message: "Note created successfully.",
        data: note,
    });
};


// GET /notes
export const getNotesController = async (req, res) => {

    const notes = await getNotesService();

    return sendSuccess(res, {
        statusCode: 200,
        message: "Notes retrieved successfully.",
        data: notes,
    });
};


// GET /notes/my-notes
export const getUserNotesController = async (req, res) => {
    const { id: userId } = req.user;

    const notes = await getUserNotesService(userId);

    return sendSuccess(res, {
        statusCode: 200,
        message: "Notes retrieved successfully.",
        data: notes,
    });
};


// GET /notes/:noteId
export const getNoteByIdController = async (req, res) => {
    const { noteId } = req.params;
    const { id: requesterId, role: requesterRole } = req.user;

    const note = await getNoteByIdService({ noteId, requesterId, requesterRole });

    return sendSuccess(res, {
        statusCode: 200,
        message: "Note retrieved successfully.",
        data: note,
    });
};


// PATCH /notes/:noteId
export const updateNoteController = async (req, res) => {
    const { noteId } = req.params;
    const { id: requesterId, role: requesterRole } = req.user;

    const note = await updateNoteService({
        noteId,
        requesterId,
        data: req.body,
    });

    return sendSuccess(res, {
        statusCode: 200,
        message: "Note updated successfully.",
        data: note,
    });
};


// DELETE /notes/:noteId
export const deleteNoteController = async (req, res) => {
    const { noteId } = req.params;
    const { id: requesterId, role: requesterRole } = req.user;

    await deleteNoteService({ noteId, requesterId, requesterRole });

    return sendSuccess(res, {
        statusCode: 200,
        message: "Note deleted successfully.",
        data: null,
    });
};
