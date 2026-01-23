import { z } from 'zod';

export const createLeaveBalanceSchema = z.object({
  userProfile: z.string().min(1, 'User Profile ID is required'),
  annualBalance: z.number().int().min(0).default(14),
  sickBalance: z.number().int().min(0).default(14),
  otherBalance: z.number().int().min(0).default(3),
  year: z.number().int().positive(),
  carriedForward: z.number().int().min(0).default(0),
});

export type CreateLeaveBalanceDto = z.infer<typeof createLeaveBalanceSchema>;
