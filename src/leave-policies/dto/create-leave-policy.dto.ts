import { z } from 'zod';

export const createLeavePolicySchema = z.object({
  tenantId: z.string().min(1, 'Tenant ID is required'),
  leaveType: z.enum(['ANNUAL', 'SICK', 'MATERNITY', 'PATERNITY', 'COMPASSIONATE', 'UNPAID']),
  maxDaysPerYear: z.number().int().min(1).default(14),
  maxConsecutiveDays: z.number().int().min(1).default(14),
  requiresApproval: z.boolean().default(true),
  noticeDaysRequired: z.number().int().min(0).default(7),
  carryForwardAllowed: z.boolean().default(false),
  maxCarryForwardDays: z.number().int().min(0).default(0),
  rules: z.record(z.string(), z.any()).optional(),
  isActive: z.boolean().default(true),
});

export type CreateLeavePolicyDto = z.infer<typeof createLeavePolicySchema>;
