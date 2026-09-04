import { useCallback } from 'react';
import { useAppDispatch, useAppSelector } from '@/app/hooks';
import { openModal, closeModal, selectModalMode, selectSelectedNoteId } from '../slices/notesUiSlice';
import type { ModalMode } from '../slices/notesUiSlice';

/**
 * Encapsulates all Redux dispatch logic for opening/closing the various note modals.
 */
export function useNoteModals() {
  const dispatch = useAppDispatch();
  const modalMode = useAppSelector(selectModalMode);
  const selectedNoteId = useAppSelector(selectSelectedNoteId);

  const openCreate = useCallback(() => {
    dispatch(openModal({ mode: 'create' }));
  }, [dispatch]);

  const openEdit = useCallback((id: string) => {
    dispatch(openModal({ mode: 'edit', noteId: id }));
  }, [dispatch]);

  const openView = useCallback((id: string) => {
    dispatch(openModal({ mode: 'view', noteId: id }));
  }, [dispatch]);

  const openDelete = useCallback((id: string) => {
    dispatch(openModal({ mode: 'delete', noteId: id }));
  }, [dispatch]);

  const close = useCallback(() => {
    dispatch(closeModal());
  }, [dispatch]);

  // Helpers for the current state
  const isCreateOpen = modalMode === 'create';
  const isEditOpen = modalMode === 'edit';
  const isViewOpen = modalMode === 'view';
  const isDeleteOpen = modalMode === 'delete';

  return {
    selectedNoteId,
    openCreate,
    openEdit,
    openView,
    openDelete,
    close,
    isCreateOpen,
    isEditOpen,
    isViewOpen,
    isDeleteOpen,
  };
}
