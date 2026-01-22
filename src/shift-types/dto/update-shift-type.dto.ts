import { z } from 'zod';

export const updateShiftTypeSchema = z.object({
  tenantId: z.string().min(1, 'Tenant ID is required').optional(),
  name: z.string().min(1, 'Name is required').optional(),
  startTime: z.string().min(1, 'Start time is required').optional(),
  endTime: z.string().min(1, 'End time is required').optional(),
  requiredStaff: z.number().int().min(1).optional(),
  breakConfig: z.object({
    duration: z.number().int().min(0),
    paid: z.boolean(),
  }).optional(),
  isActive: z.boolean().optional(),
});

export type UpdateShiftTypeDto = z.infer<typeof updateShiftTypeSchema>;
