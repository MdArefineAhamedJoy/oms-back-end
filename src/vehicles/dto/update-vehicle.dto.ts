import { z } from 'zod';

export const updateVehicleSchema = z.object({
  site: z.string().min(1, 'Site ID is required').optional(),
  checkedInBy: z.string().optional(),
  registrationNumber: z.string().min(1, 'Registration Number is required').optional(),
  make: z.string().min(1, 'Make is required').optional(),
  model: z.string().min(1, 'Model is required').optional(),
  color: z.string().min(1, 'Color is required').optional(),
  ownerName: z.string().min(1, 'Owner Name is required').optional(),
  contactNumber: z.string().min(1, 'Contact Number is required').optional(),
  checkInTime: z.coerce.date().optional(),
  checkOutTime: z.coerce.date().optional(),
  parkingStatus: z.enum(['PARKED', 'EXITED', 'OVERDUE']).optional(),
  notes: z.string().optional(),
  parkingSpot: z.string().optional(),
});

export type UpdateVehicleDto = z.infer<typeof updateVehicleSchema>;
