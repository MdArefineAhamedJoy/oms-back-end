import { z } from 'zod';

const locationSchema = z.object({
  lat: z.number(),
  lng: z.number(),
});

export const createCheckpointSchema = z.object({
  site: z.string().min(1, 'Site ID is required'),
  name: z.string().min(1, 'Name is required'),
  description: z.string().optional(),
  location: locationSchema,
  qrCode: z.string().min(1, 'QR Code is required'),
  isActive: z.boolean().default(true),
  priorityOrder: z.number().int().default(0),
});

export type CreateCheckpointDto = z.infer<typeof createCheckpointSchema>;
