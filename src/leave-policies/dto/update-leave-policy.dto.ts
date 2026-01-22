import { z } from 'zod';

export const updateLeavePolicySchema = z.object({
  tenantId: z.string().min(1, 'Tenant ID is required').optional(),
  leaveType: z.enum(['ANNUAL', 'SICK', 'MATERNITY', 'PATERNITY', 'COMPASSIONATE', 'UNPAID']).optional(),
  maxDaysPerYear: z.number().int().min(1).optional(),
  maxConsecutiveDays: z.number().int().min(1).optional(),
  requiresApproval: z.boolean().optional(),
  noticeDaysRequired: z.number().int().min(0).optional(),
  carryForwardAllowed: z.boolean().optional(),
  maxCarryForwardDays: z.number().int().min(0).optional(),
  rules: z.record(z.string(), z.any()).optional(),
  isActive: z.boolean().optional(),
});

export type UpdateLeavePolicyDto = z.infer<typeof updateLeavePolicySchema>;
