import { z } from 'zod';

export const updateLeaveRequestSchema = z.object({
  user: z.string().min(1, 'User ID is required').optional(),
  startDate: z.coerce.date().optional(),
  endDate: z.coerce.date().optional(),
  leaveType: z.enum(['ANNUAL', 'SICK', 'MATERNITY', 'PATERNITY', 'COMPASSIONATE', 'UNPAID']).optional(),
  reason: z.string().min(1, 'Reason is required').optional(),
  requestStatus: z.enum(['PENDING', 'APPROVED', 'REJECTED', 'CANCELLED']).optional(),
  approvedBy: z.string().optional(),
  approvedAt: z.coerce.date().optional(),
  rejectionReason: z.string().optional(),
  totalDays: z.number().int().positive().optional(),
});

export type UpdateLeaveRequestDto = z.infer<typeof updateLeaveRequestSchema>;
