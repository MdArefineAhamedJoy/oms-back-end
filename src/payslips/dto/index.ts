import { z } from 'zod';

export const createPaySlipSchema = z.object({
  month: z.enum(['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December']),
  year: z.number().int().positive(),
  payDate: z.coerce.date(),
  allowance: z.number().optional(),
  netSalary: z.number(),
  basicSalary: z.number(),
  user: z.string().optional(),
  additionalTransactions: z.array(z.any()).optional(),
});

export type CreatePaySlipDto = z.infer<typeof createPaySlipSchema>;

export const updatePaySlipSchema = z.object({
  month: z.enum(['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December']).optional(),
  year: z.number().int().positive().optional(),
  payDate: z.coerce.date().optional(),
  allowance: z.number().optional(),
  netSalary: z.number().optional(),
  basicSalary: z.number().optional(),
  user: z.string().optional(),
  additionalTransactions: z.array(z.any()).optional(),
});

export type UpdatePaySlipDto = z.infer<typeof updatePaySlipSchema>;
