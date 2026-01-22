import { z } from 'zod';

export const updateIncidentTypeSchema = z.object({
  name: z.string().min(1, 'Name is required').optional(),
  description: z.string().optional(),
  isActive: z.boolean().optional(),
  priorityOrder: z.number().int().optional(),
});

export type UpdateIncidentTypeDto = z.infer<typeof updateIncidentTypeSchema>;
