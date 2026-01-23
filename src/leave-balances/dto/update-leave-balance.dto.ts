import { z } from 'zod';

export const updateLeaveBalanceSchema = z.object({
  userProfile: z.string().min(1, 'User Profile ID is required').optional(),
  annualBalance: z.number().int().min(0).optional(),
  sickBalance: z.number().int().min(0).optional(),
  otherBalance: z.number().int().min(0).optional(),
  year: z.number().int().positive().optional(),
  carriedForward: z.number().int().min(0).optional(),
});

export type UpdateLeaveBalanceDto = z.infer<typeof updateLeaveBalanceSchema>;
