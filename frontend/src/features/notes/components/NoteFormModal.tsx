import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { noteSchema, type NoteFormData } from '../validation/notes.schemas';
import type { Note } from '../types/notes.types';
import { Modal, FormField, Input, Textarea, Button } from '@/shared/components/ui';
import './NoteFormModal.css'

interface NoteFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  noteToEdit?: Note;
  onSave: (data: NoteFormData) => Promise<void>;
  isSaving: boolean;
}

export function NoteFormModal({
  isOpen,
  onClose,
  noteToEdit,
  onSave,
  isSaving,
}: NoteFormModalProps) {
  const isEdit = !!noteToEdit;

  const {
    register,
    handleSubmit,
    reset,
    watch,
    formState: { errors },
  } = useForm<NoteFormData>({
    resolver: zodResolver(noteSchema),
    defaultValues: { title: '', content: '' },
  });

  // Reset form when modal opens or noteToEdit changes
  useEffect(() => {
    if (isOpen) {
      reset({
        title: noteToEdit?.title ?? '',
        content: noteToEdit?.content ?? '',
      });
    }
  }, [isOpen, noteToEdit, reset]);

  const contentValue = watch('content', '');

  const onSubmit = async (data: NoteFormData) => {
    await onSave(data);
    // Note: onSave (handleCreate/handleUpdate in NotesPage) calls modals.close()
    // on success and re-throws on failure — so this line is never reached on error.
  };


  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={isEdit ? 'Edit Note' : 'Create Note'}
      maxWidth={620}
      footer={
        <>
          <Button variant="secondary" onClick={onClose} disabled={isSaving}>
            Cancel
          </Button>
          <Button onClick={handleSubmit(onSubmit)} isLoading={isSaving}>
            {isEdit ? 'Save Changes' : 'Create Note'}
          </Button>
        </>
      }
    >
      <form onSubmit={handleSubmit(onSubmit)} noValidate id="note-form">
        <FormField label="Title" htmlFor="title" required error={errors.title?.message}>
          <Input
            id="title"
            placeholder="Note title"
            autoFocus
            disabled={isSaving}
            hasError={!!errors.title}
            {...register('title')}
          />
        </FormField>

        <FormField label="Content" htmlFor="content" required error={errors.content?.message}>
          <Textarea
            id="content"
            placeholder="Write your note here..."
            rows={8}
            disabled={isSaving}
            hasError={!!errors.content}
            showCounter
            currentLength={contentValue.length}
            {...register('content')}
          />
        </FormField>
      </form>
    </Modal>
  );
}
