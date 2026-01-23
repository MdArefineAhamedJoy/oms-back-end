import { z } from 'zod';

export const createVisitorSchema = z.object({
  site: z.string().min(1, 'Site ID is required'),
  checkedInBy: z.string().optional(),
  name: z.string().min(1, 'Name is required'),
  identificationNumber: z.string().min(1, 'Identification Number is required'),
  visitorType: z.enum(['WALK_IN', 'SCHEDULED', 'DELIVERY', 'CONTRACTOR', 'INTERVIEW']),
  checkInTime: z.coerce.date(),
  checkOutTime: z.coerce.date().optional(),
  purpose: z.string().min(1, 'Purpose is required'),
  host: z.string().min(1, 'Host is required'),
  notes: z.string().optional(),
  signature: z.string().optional(),
  photo: z.string().optional(),
  status: z.enum(['CHECKED_IN', 'CHECKED_OUT', 'OVERDUE']).default('CHECKED_IN'),
});

export type CreateVisitorDto = z.infer<typeof createVisitorSchema>;
