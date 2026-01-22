import { z } from 'zod';

export const updateIncidentSubtypeSchema = z.object({
  incidentType: z.string().min(1, 'Incident Type ID is required').optional(),
  name: z.string().min(1, 'Name is required').optional(),
  description: z.string().optional(),
  isActive: z.boolean().optional(),
});

export type UpdateIncidentSubtypeDto = z.infer<typeof updateIncidentSubtypeSchema>;
