import { z } from 'zod';

export const createClientSchema = z.object({
  tenantId: z.string().min(1, 'Tenant ID is required'),
  name: z.string().min(1, 'Name is required'),
  contactPerson: z.string().optional(),
  email: z.string().email('Invalid email format'),
  phone: z.string().min(1, 'Phone is required'),
  address: z.string().optional(),
  clientStatus: z.enum(['ACTIVE', 'INACTIVE']),
});

export type CreateClientDto = z.infer<typeof createClientSchema>;
