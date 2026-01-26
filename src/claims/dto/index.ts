import { z } from 'zod';

export const createClaimSchema = z.object({
  expenseDate: z.coerce.date(),
  amount: z.number().positive(),
  purpose: z.string().min(1),
  attachment: z.array(z.string()).optional(),
  claimStatus: z.enum(['pending', 'approved', 'rejected']).default('pending'),
  actionBy: z.string().optional(),
  user: z.string().optional(),
  category: z.record(z.any()).optional(),
});

export type CreateClaimDto = z.infer<typeof createClaimSchema>;

export const updateClaimSchema = z.object({
  expenseDate: z.coerce.date().optional(),
  amount: z.number().positive().optional(),
  purpose: z.string().min(1).optional(),
  attachment: z.array(z.string()).optional(),
  claimStatus: z.enum(['pending', 'approved', 'rejected']).optional(),
  actionBy: z.string().optional(),
  user: z.string().optional(),
  category: z.record(z.any()).optional(),
});

export type UpdateClaimDto = z.infer<typeof updateClaimSchema>;
