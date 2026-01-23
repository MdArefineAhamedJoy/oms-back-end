import { z } from 'zod';

export const updateVisitorSchema = z.object({
  site: z.string().min(1, 'Site ID is required').optional(),
  checkedInBy: z.string().optional(),
  name: z.string().min(1, 'Name is required').optional(),
  identificationNumber: z.string().min(1, 'Identification Number is required').optional(),
  visitorType: z.enum(['WALK_IN', 'SCHEDULED', 'DELIVERY', 'CONTRACTOR', 'INTERVIEW']).optional(),
  checkInTime: z.coerce.date().optional(),
  checkOutTime: z.coerce.date().optional(),
  purpose: z.string().min(1, 'Purpose is required').optional(),
  host: z.string().min(1, 'Host is required').optional(),
  notes: z.string().optional(),
  signature: z.string().optional(),
  photo: z.string().optional(),
  status: z.enum(['CHECKED_IN', 'CHECKED_OUT', 'OVERDUE']).optional(),
});

export type UpdateVisitorDto = z.infer<typeof updateVisitorSchema>;
