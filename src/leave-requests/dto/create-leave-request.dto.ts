import { z } from 'zod';

export const createLeaveRequestSchema = z.object({
  user: z.string().min(1, 'User ID is required'),
  startDate: z.coerce.date(),
  endDate: z.coerce.date(),
  leaveType: z.enum(['ANNUAL', 'SICK', 'MATERNITY', 'PATERNITY', 'COMPASSIONATE', 'UNPAID']),
  reason: z.string().min(1, 'Reason is required'),
  requestStatus: z.enum(['PENDING', 'APPROVED', 'REJECTED', 'CANCELLED']).default('PENDING'),
  approvedBy: z.string().optional(),
  approvedAt: z.coerce.date().optional(),
  rejectionReason: z.string().optional(),
  totalDays: z.number().int().positive().default(1),
});

export type CreateLeaveRequestDto = z.infer<typeof createLeaveRequestSchema>;
