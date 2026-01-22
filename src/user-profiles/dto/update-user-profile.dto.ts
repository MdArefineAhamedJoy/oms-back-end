import { z } from 'zod';

export const updateUserProfileSchema = z.object({
  tenantId: z.string().min(1, 'Tenant ID is required').optional(),
  firstName: z.string().min(1, 'First name is required').optional(),
  lastName: z.string().optional(),
  employeeId: z.string().optional(),
  phone: z.string().min(1, 'Phone is required').optional(),
  role: z.enum(['SUPER_ADMIN', 'OM', 'OFFICER', 'CLIENT']).optional(),
  userStatus: z.enum(['ACTIVE', 'INACTIVE', 'SUSPENDED']).optional(),
  lastLogin: z.string().datetime().optional(),
  failedAttempts: z.number().int().min(0).optional(),
  lockedUntil: z.string().datetime().optional(),
  dateOfBirth: z.string().datetime().optional(),
  hiredDate: z.string().datetime().optional(),
  address: z.string().optional(),
  emergencyContact: z.string().optional(),
  emergencyPhone: z.string().optional(),
  profilePhoto: z.string().optional(),
  siteIds: z.array(z.string()).optional(),
  clientId: z.string().optional(),
  permissions: z.record(z.string(), z.any()).optional(),
  metadata: z.record(z.string(), z.any()).optional(),
});

export type UpdateUserProfileDto = z.infer<typeof updateUserProfileSchema>;
