import { z } from 'zod';

export const createPatrolSchema = z.object({
  tenant: z.string().min(1, 'Tenant ID is required'),
  site: z.string().min(1, 'Site ID is required'),
  user: z.string().min(1, 'User ID is required'),
  shift: z.string().min(1, 'Shift ID is required'),
  patrolRoute: z.string().optional(),
  startTime: z.coerce.date(),
  endTime: z.coerce.date().optional(),
  patrolStatus: z.enum(['IN_PROGRESS', 'COMPLETED', 'ABANDONED']).default('IN_PROGRESS'),
  patrolExecutionStatus: z.enum(['ONGOING', 'COMPLETED']).optional(),
  totalScans: z.number().int().default(0),
  missedScans: z.number().int().default(0),
  notes: z.string().optional(),
});

export type CreatePatrolDto = z.infer<typeof createPatrolSchema>;
