import { z } from 'zod';

const routeDataSchema = z.object({
  distance: z.number().nonnegative(),
  estimatedTime: z.number().nonnegative(),
  checkpoints: z.array(z.string()),
});

export const createPatrolRouteSchema = z.object({
  site: z.string().min(1, 'Site ID is required'),
  name: z.string().min(1, 'Name is required'),
  description: z.string().optional(),
  routeData: routeDataSchema.optional(),
  isActive: z.boolean().default(true),
  priorityOrder: z.number().int().default(0),
});

export type CreatePatrolRouteDto = z.infer<typeof createPatrolRouteSchema>;
