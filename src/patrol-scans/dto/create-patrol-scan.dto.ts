import { z } from 'zod';

const locationSchema = z.object({
  lat: z.number(),
  lng: z.number(),
});

export const createPatrolScanSchema = z.object({
  patrol: z.string().min(1, 'Patrol ID is required'),
  checkpoint: z.string().min(1, 'Checkpoint ID is required'),
  scanTime: z.coerce.date(),
  location: locationSchema,
  notes: z.string().optional(),
  scanPhoto: z.string().optional(),
  isMissed: z.boolean().default(false),
});

export type CreatePatrolScanDto = z.infer<typeof createPatrolScanSchema>;
