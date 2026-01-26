import { z } from 'zod';

export const createGeofenceOverrideSchema = z.object({
  tenant: z.string().optional(),
  shift: z.string().optional(),
  user: z.string().optional(),
  site: z.string().optional(),
  overrideType: z.enum(['CHECK_IN', 'CHECK_OUT']),
  reason: z.enum(['EMERGENCY', 'PARKING', 'TECHNICAL_ISSUE', 'OTHER']),
  reasonDetails: z.string().optional(),
  distance: z.number().min(0),
  userLocation: z.record(z.any()),
  siteLocation: z.record(z.any()),
  overrideStatus: z.enum(['PENDING', 'AUTO_APPROVED', 'APPROVED', 'REJECTED']).default('PENDING'),
  approvedBy: z.string().optional(),
  approvalNotes: z.string().optional(),
  approvedAt: z.coerce.date().optional(),
  ipAddress: z.string().max(50).optional(),
  deviceInfo: z.record(z.any()).optional(),
  userAgent: z.string().max(500).optional(),
});

export type CreateGeofenceOverrideDto = z.infer<typeof createGeofenceOverrideSchema>;

export const updateGeofenceOverrideSchema = z.object({
  tenant: z.string().optional(),
  shift: z.string().optional(),
  user: z.string().optional(),
  site: z.string().optional(),
  overrideType: z.enum(['CHECK_IN', 'CHECK_OUT']).optional(),
  reason: z.enum(['EMERGENCY', 'PARKING', 'TECHNICAL_ISSUE', 'OTHER']).optional(),
  reasonDetails: z.string().optional(),
  distance: z.number().min(0).optional(),
  userLocation: z.record(z.any()).optional(),
  siteLocation: z.record(z.any()).optional(),
  overrideStatus: z.enum(['PENDING', 'AUTO_APPROVED', 'APPROVED', 'REJECTED']).optional(),
  approvedBy: z.string().optional(),
  approvalNotes: z.string().optional(),
  approvedAt: z.coerce.date().optional(),
  ipAddress: z.string().max(50).optional(),
  deviceInfo: z.record(z.any()).optional(),
  userAgent: z.string().max(500).optional(),
});

export type UpdateGeofenceOverrideDto = z.infer<typeof updateGeofenceOverrideSchema>;
