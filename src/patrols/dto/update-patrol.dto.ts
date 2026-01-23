import { z } from 'zod';

export const updatePatrolSchema = z.object({
  tenant: z.string().min(1, 'Tenant ID is required').optional(),
  site: z.string().min(1, 'Site ID is required').optional(),
  user: z.string().min(1, 'User ID is required').optional(),
  shift: z.string().min(1, 'Shift ID is required').optional(),
  patrolRoute: z.string().optional(),
  startTime: z.coerce.date().optional(),
  endTime: z.coerce.date().optional(),
  patrolStatus: z.enum(['IN_PROGRESS', 'COMPLETED', 'ABANDONED']).optional(),
  patrolExecutionStatus: z.enum(['ONGOING', 'COMPLETED']).optional(),
  totalScans: z.number().int().optional(),
  missedScans: z.number().int().optional(),
  notes: z.string().optional(),
});

export type UpdatePatrolDto = z.infer<typeof updatePatrolSchema>;
