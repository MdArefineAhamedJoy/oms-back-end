import { z } from 'zod';

const locationSchema = z.object({
  lat: z.number(),
  lng: z.number(),
});

export const updatePatrolScanSchema = z.object({
  patrol: z.string().min(1, 'Patrol ID is required').optional(),
  checkpoint: z.string().min(1, 'Checkpoint ID is required').optional(),
  scanTime: z.coerce.date().optional(),
  location: locationSchema.optional(),
  notes: z.string().optional(),
  scanPhoto: z.string().optional(),
  isMissed: z.boolean().optional(),
});

export type UpdatePatrolScanDto = z.infer<typeof updatePatrolScanSchema>;
