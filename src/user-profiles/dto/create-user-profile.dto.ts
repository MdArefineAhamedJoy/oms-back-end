import { z } from 'zod';

export const createUserProfileSchema = z.object({
  tenantId: z.string().min(1, 'Tenant ID is required'),
  firstName: z.string().min(1, 'First name is required'),
  lastName: z.string().optional(),
  employeeId: z.string().optional(),
  phone: z.string().min(1, 'Phone is required'),
  role: z.enum(['SUPER_ADMIN', 'OM', 'OFFICER', 'CLIENT']),
  userStatus: z.enum(['ACTIVE', 'INACTIVE', 'SUSPENDED']).default('ACTIVE'),
  dateOfBirth: z.string().datetime().optional(),
  hiredDate: z.string().datetime().optional(),
  address: z.string().optional(),
  emergencyContact: z.string().optional(),
  emergencyPhone: z.string().optional(),
  profilePhoto: z.string().optional(),
  siteIds: z.array(z.string()).default([]),
  clientId: z.string().optional(),
  permissions: z.record(z.string(), z.any()).optional(),
  metadata: z.record(z.string(), z.any()).optional(),
});

export type CreateUserProfileDto = z.infer<typeof createUserProfileSchema>;
