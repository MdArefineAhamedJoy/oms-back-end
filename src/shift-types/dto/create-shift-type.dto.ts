import { z } from 'zod';

export const createShiftTypeSchema = z.object({
  tenantId: z.string().min(1, 'Tenant ID is required'),
  name: z.string().min(1, 'Name is required'),
  startTime: z.string().min(1, 'Start time is required'),
  endTime: z.string().min(1, 'End time is required'),
  requiredStaff: z.number().int().min(1).default(1),
  breakConfig: z.object({
    duration: z.number().int().min(0),
    paid: z.boolean(),
  }).optional(),
  isActive: z.boolean().default(true),
});

export type CreateShiftTypeDto = z.infer<typeof createShiftTypeSchema>;
