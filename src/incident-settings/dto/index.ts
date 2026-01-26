import { z } from 'zod';

export const createIncidentSettingSchema = z.object({
  severityOptions: z.record(z.any()).optional(),
  priorityOptions: z.record(z.any()).optional(),
  statusOptions: z.record(z.any()).optional(),
});

export type CreateIncidentSettingDto = z.infer<typeof createIncidentSettingSchema>;

export const updateIncidentSettingSchema = z.object({
  severityOptions: z.record(z.any()).optional(),
  priorityOptions: z.record(z.any()).optional(),
  statusOptions: z.record(z.any()).optional(),
});

export type UpdateIncidentSettingDto = z.infer<typeof updateIncidentSettingSchema>;
