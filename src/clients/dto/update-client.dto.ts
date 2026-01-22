import { z } from 'zod';

export const updateClientSchema = z
  .object({
    name: z.string().min(1, 'Name is required').optional(),
    contactPerson: z.string().optional(),
    email: z.string().email('Invalid email format').optional(),
    phone: z.string().min(1, 'Phone is required').optional(),
    address: z.string().optional(),
    clientStatus: z.enum(['ACTIVE', 'INACTIVE']).optional(),
  })
  .partial();

export type UpdateClientDto = z.infer<typeof updateClientSchema>;
