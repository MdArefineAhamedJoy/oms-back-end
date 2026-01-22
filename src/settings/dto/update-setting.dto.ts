import { z } from 'zod';

export const updateSettingSchema = z.object({
  tenantId: z.string().min(1, 'Tenant ID is required').optional(),
  key: z.string().min(1, 'Key is required').optional(),
  value: z.any().optional(),
  category: z.string().min(1, 'Category is required').optional(),
  description: z.string().optional(),
});

export type UpdateSettingDto = z.infer<typeof updateSettingSchema>;
