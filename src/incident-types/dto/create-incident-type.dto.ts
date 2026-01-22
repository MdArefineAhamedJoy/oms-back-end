import { z } from 'zod';

export const createIncidentTypeSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  description: z.string().optional(),
  isActive: z.boolean().default(true),
  priorityOrder: z.number().int().default(0),
});

export type CreateIncidentTypeDto = z.infer<typeof createIncidentTypeSchema>;
