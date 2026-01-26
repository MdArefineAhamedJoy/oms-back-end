import { z } from 'zod';

export const createAppVersionSchema = z.object({
  version: z.string().min(1).max(20),
  commitHash: z.string().min(1).max(64),
  notes: z.string().optional(),
});

export type CreateAppVersionDto = z.infer<typeof createAppVersionSchema>;

export const updateAppVersionSchema = z.object({
  version: z.string().min(1).max(20).optional(),
  commitHash: z.string().min(1).max(64).optional(),
  notes: z.string().optional(),
});

export type UpdateAppVersionDto = z.infer<typeof updateAppVersionSchema>;
