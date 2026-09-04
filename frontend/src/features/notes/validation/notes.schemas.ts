import { z } from 'zod';
import { NOTE_CONSTRAINTS } from '@/constants/app.constants';

// Note form validation schema — mirrors backend exactly
export const noteSchema = z.object({
  title: z
    .string()
    .min(1, 'Title is required')
    .max(NOTE_CONSTRAINTS.TITLE_MAX, `Title must be at most ${NOTE_CONSTRAINTS.TITLE_MAX} characters`),
  content: z
    .string()
    .min(1, 'Content is required')
    .max(NOTE_CONSTRAINTS.CONTENT_MAX, `Content must be at most ${NOTE_CONSTRAINTS.CONTENT_MAX} characters`),
});

export type NoteFormData = z.infer<typeof noteSchema>;
