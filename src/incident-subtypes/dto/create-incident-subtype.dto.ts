import { z } from 'zod';

export const createIncidentSubtypeSchema = z.object({
  incidentType: z.string().min(1, 'Incident Type ID is required'),
  name: z.string().min(1, 'Name is required'),
  description: z.string().optional(),
  isActive: z.boolean().default(true),
});

export type CreateIncidentSubtypeDto = z.infer<typeof createIncidentSubtypeSchema>;
