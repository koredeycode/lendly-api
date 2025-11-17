import { z } from 'zod';

export const validationSchema = z.object({
  PORT: z.string().optional(),
  DATABASE_URL: z.string().url(),
  JWT_SECRET: z.string().min(10),
});

export type AppConfig = z.infer<typeof validationSchema>;
