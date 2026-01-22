import { z } from 'zod';

export const createSettingSchema = z.object({
  tenantId: z.string().min(1, 'Tenant ID is required'),
  key: z.string().min(1, 'Key is required'),
  value: z.any(),
  category: z.string().min(1, 'Category is required'),
  description: z.string().optional(),
});

export type CreateSettingDto = z.infer<typeof createSettingSchema>;
