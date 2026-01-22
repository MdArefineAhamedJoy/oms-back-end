import { z } from 'zod';

const routeDataSchema = z.object({
  distance: z.number().nonnegative(),
  estimatedTime: z.number().nonnegative(),
  checkpoints: z.array(z.string()),
});

export const updatePatrolRouteSchema = z.object({
  site: z.string().min(1, 'Site ID is required').optional(),
  name: z.string().min(1, 'Name is required').optional(),
  description: z.string().optional(),
  routeData: routeDataSchema.optional(),
  isActive: z.boolean().optional(),
  priorityOrder: z.number().int().optional(),
});

export type UpdatePatrolRouteDto = z.infer<typeof updatePatrolRouteSchema>;
