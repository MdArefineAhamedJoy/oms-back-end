import { z } from 'zod';

export const updateTenantSchema = z.object({
  name: z.string().min(1).optional(),
  tenantCode: z.string().min(1).optional(),
  email: z.string().email().optional(),
  phone: z.string().min(1).optional(),
  licenseNumber: z.string().min(1).optional(),
  subscriptionPlan: z.enum(['BASIC', 'STANDARD', 'PREMIUM']).optional(),
  maxSites: z.number().int().positive().optional(),
  maxUsers: z.number().int().positive().optional(),
  settings: z.record(z.string(), z.any()).optional(),
  tenantStatus: z.enum(['ACTIVE', 'INACTIVE', 'SUSPENDED']).optional(),
});

export type UpdateTenantDto = z.infer<typeof updateTenantSchema>;
