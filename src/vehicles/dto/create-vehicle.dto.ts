import { z } from 'zod';

export const createVehicleSchema = z.object({
  site: z.string().min(1, 'Site ID is required'),
  checkedInBy: z.string().optional(),
  registrationNumber: z.string().min(1, 'Registration Number is required'),
  make: z.string().min(1, 'Make is required'),
  model: z.string().min(1, 'Model is required'),
  color: z.string().min(1, 'Color is required'),
  ownerName: z.string().min(1, 'Owner Name is required'),
  contactNumber: z.string().min(1, 'Contact Number is required'),
  checkInTime: z.coerce.date(),
  checkOutTime: z.coerce.date().optional(),
  parkingStatus: z.enum(['PARKED', 'EXITED', 'OVERDUE']).default('PARKED'),
  notes: z.string().optional(),
  parkingSpot: z.string().optional(),
});

export type CreateVehicleDto = z.infer<typeof createVehicleSchema>;
