import { z } from 'zod';

const locationSchema = z.object({
  lat: z.number(),
  lng: z.number(),
});

export const updateCheckpointSchema = z.object({
  site: z.string().min(1, 'Site ID is required').optional(),
  name: z.string().min(1, 'Name is required').optional(),
  description: z.string().optional(),
  location: locationSchema.optional(),
  qrCode: z.string().min(1, 'QR Code is required').optional(),
  isActive: z.boolean().optional(),
  priorityOrder: z.number().int().optional(),
});

export type UpdateCheckpointDto = z.infer<typeof updateCheckpointSchema>;
