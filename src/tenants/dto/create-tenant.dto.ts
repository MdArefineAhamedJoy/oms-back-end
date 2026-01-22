import { z } from 'zod';

export const createTenantSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  tenantCode: z.string().min(1, 'Tenant code is required'),
  email: z.string().email('Invalid email format'),
  phone: z.string().min(1, 'Phone is required'),
  licenseNumber: z.string().min(1, 'License number is required'),
  subscriptionPlan: z.enum(['BASIC', 'STANDARD', 'PREMIUM']).optional(),
  maxSites: z.number().int().positive().optional(),
  maxUsers: z.number().int().positive().optional(),
  settings: z.record(z.string(), z.any()).optional(),
  tenantStatus: z.enum(['ACTIVE', 'INACTIVE', 'SUSPENDED']),
});

export type CreateTenantDto = z.infer<typeof createTenantSchema>;
