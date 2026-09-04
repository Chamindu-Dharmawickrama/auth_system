import { z } from 'zod';

export const updateProfileSchema = z.object({
  email: z.string().email('Enter a valid email address').optional().or(z.literal('')),
  avatarUrl: z.string().url('Must be a valid URL').optional().or(z.literal('')),
});

export type UpdateProfileFormData = z.infer<typeof updateProfileSchema>;
