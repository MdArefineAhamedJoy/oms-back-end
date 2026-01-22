import { z } from 'zod';

export const updateSiteSchema = z
  .object({
    name: z.string().min(1, 'Name is required').optional(),
    siteCode: z.string().min(1, 'Site code is required').optional(),
    address: z.string().min(1, 'Address is required').optional(),
    coordinates: z
      .object({
        lat: z.number(),
        lng: z.number(),
      })
      .optional(),
    geofenceRadius: z.number().positive().optional(),
    timezone: z.string().optional(),
    settings: z.record(z.string(), z.any()).optional(),
    siteStatus: z.enum(['ACTIVE', 'INACTIVE']).optional(),
  })
  .partial();

export type UpdateSiteDto = z.infer<typeof updateSiteSchema>;
