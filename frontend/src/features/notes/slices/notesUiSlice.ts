import { createSlice, type PayloadAction } from "@reduxjs/toolkit";

export type ModalMode = "create" | "edit" | "view" | "delete" | null;

interface NotesUiState {
   modalMode: ModalMode;
   /** The ID of the note currently being edited, viewed, or deleted */
   selectedNoteId: string | null;
}

const initialState: NotesUiState = {
   modalMode: null,
   selectedNoteId: null,
};

/**
 * UI-only state slice for the Notes feature.
 * This slice just handles which modal is open and for which note.
 */
const notesUiSlice = createSlice({
   name: "notesUi",
   initialState,
   reducers: {
      openModal(
         state,
         action: PayloadAction<{ mode: ModalMode; noteId?: string }>,
      ) {
         state.modalMode = action.payload.mode;
         state.selectedNoteId = action.payload.noteId ?? null;
      },
      closeModal(state) {
         state.modalMode = null;
         state.selectedNoteId = null;
      },
   },
});

export const { openModal, closeModal } = notesUiSlice.actions;

export const selectModalMode = (state: { notesUi: NotesUiState }) =>
   state.notesUi.modalMode;
export const selectSelectedNoteId = (state: { notesUi: NotesUiState }) =>
   state.notesUi.selectedNoteId;

export default notesUiSlice.reducer;
