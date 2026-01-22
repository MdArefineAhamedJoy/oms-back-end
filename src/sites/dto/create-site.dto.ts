import { z } from 'zod';

export const createSiteSchema = z.object({
  tenantId: z.string().min(1, 'Tenant ID is required'),
  name: z.string().min(1, 'Name is required'),
  siteCode: z.string().min(1, 'Site code is required'),
  address: z.string().min(1, 'Address is required'),
  coordinates: z.object({
    lat: z.number(),
    lng: z.number(),
  }),
  geofenceRadius: z.number().positive().optional(),
  timezone: z.string().optional(),
  settings: z.record(z.string(), z.any()).optional(),
  siteStatus: z.enum(['ACTIVE', 'INACTIVE']),
});

export type CreateSiteDto = z.infer<typeof createSiteSchema>;
