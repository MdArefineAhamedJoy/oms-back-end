import { z } from 'zod';

const locationSchema = z.object({
  lat: z.number(),
  lng: z.number(),
}).optional();

export const updateShiftSchema = z.object({
  tenant: z.string().min(1, 'Tenant ID is required').optional(),
  site: z.string().min(1, 'Site ID is required').optional(),
  user: z.string().min(1, 'User ID is required').optional(),
  shiftType: z.string().min(1, 'Shift Type ID is required').optional(),
  shiftDate: z.coerce.date().optional(),
  startTime: z.coerce.date().optional(),
  endTime: z.coerce.date().optional(),
  dutyPost: z.string().optional(),
  checkInTime: z.coerce.date().optional(),
  checkInLocation: locationSchema,
  checkOutTime: z.coerce.date().optional(),
  checkOutLocation: locationSchema,
  overtimeMinutes: z.number().int().optional(),
  shiftStatus: z.enum(['SCHEDULED', 'ONGOING', 'COMPLETED', 'MISSED']).optional(),
  notes: z.string().optional(),
  requiredStaff: z.number().int().optional(),
  checkInPhoto: z.string().optional(),
  checkOutPhoto: z.string().optional(),
  checkInNote: z.string().optional(),
  checkOutNote: z.string().optional(),
  lateArrivalReason: z.enum(['TRAFFIC', 'TRANSPORT_DELAY', 'WEATHER', 'ILLNESS', 'PERSONAL_EMERGENCY', 'OTHER']).optional(),
  lateArrivalNote: z.string().optional(),
  postConfirmed: z.boolean().optional(),
  postConfirmationNote: z.string().optional(),
  breakStartTime: z.coerce.date().optional(),
  breakEndTime: z.coerce.date().optional(),
  manualAdjustment: z.boolean().optional(),
  adjustedBy: z.string().optional(),
});

export type UpdateShiftDto = z.infer<typeof updateShiftSchema>;
