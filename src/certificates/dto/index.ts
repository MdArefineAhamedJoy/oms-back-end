import { z } from 'zod';

export const createCertificateSchema = z.object({
  name: z.string().min(1),
  expiryDate: z.coerce.date(),
  attachement: z.array(z.string()).optional(),
  user_profile: z.string().optional(),
});

export type CreateCertificateDto = z.infer<typeof createCertificateSchema>;

export const updateCertificateSchema = z.object({
  name: z.string().min(1).optional(),
  expiryDate: z.coerce.date().optional(),
  attachement: z.array(z.string()).optional(),
  user_profile: z.string().optional(),
});

export type UpdateCertificateDto = z.infer<typeof updateCertificateSchema>;
