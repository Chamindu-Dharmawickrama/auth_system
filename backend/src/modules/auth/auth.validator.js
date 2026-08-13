import { z } from "zod";

export const loginSchema = z.object({
    body: z.object({
        username: z.string().min(1, 'Username is required').max(20),
        password: z.string().min(1, 'Password is required').max(128),
    })
});

const strongPassword = z
    .string()
    .min(8,   'Password must be at least 8 characters')
    .max(128, 'Password is too long')
    .regex(/[A-Z]/,         'Password must contain at least one uppercase letter')
    .regex(/[a-z]/,         'Password must contain at least one lowercase letter')
    .regex(/\d/,            'Password must contain at least one number')
    .regex(/[^A-Za-z0-9]/, 'Password must contain at least one special character');

export const registerSchema = z.object({
    body: z.object({
        username: z
            .string()
            .min(3, 'Username must be at least 3 characters')
            .max(20, 'Username must be at most 20 characters')
            .regex(/^[a-zA-Z0-9_]+$/, 'Username can only contain letters, numbers, and underscores'),

        email: z
            .string()
            .email('Must be a valid email address')
            .max(254, 'Email is too long'),

        password: strongPassword,
    })
});
