import { z } from 'zod';

const locationSchema = z.object({
  lat: z.number(),
  lng: z.number(),
}).optional();

export const createShiftSchema = z.object({
  tenant: z.string().min(1, 'Tenant ID is required'),
  site: z.string().min(1, 'Site ID is required'),
  user: z.string().min(1, 'User ID is required'),
  shiftType: z.string().min(1, 'Shift Type ID is required'),
  shiftDate: z.coerce.date(),
  startTime: z.coerce.date(),
  endTime: z.coerce.date(),
  dutyPost: z.string().optional(),
  checkInTime: z.coerce.date().optional(),
  checkInLocation: locationSchema,
  checkOutTime: z.coerce.date().optional(),
  checkOutLocation: locationSchema,
  overtimeMinutes: z.number().int().default(0),
  shiftStatus: z.enum(['SCHEDULED', 'ONGOING', 'COMPLETED', 'MISSED']).default('SCHEDULED'),
  notes: z.string().optional(),
  requiredStaff: z.number().int().default(0),
  checkInPhoto: z.string().optional(),
  checkOutPhoto: z.string().optional(),
  checkInNote: z.string().optional(),
  checkOutNote: z.string().optional(),
  lateArrivalReason: z.enum(['TRAFFIC', 'TRANSPORT_DELAY', 'WEATHER', 'ILLNESS', 'PERSONAL_EMERGENCY', 'OTHER']).optional(),
  lateArrivalNote: z.string().optional(),
  postConfirmed: z.boolean().default(false),
  postConfirmationNote: z.string().optional(),
  breakStartTime: z.coerce.date().optional(),
  breakEndTime: z.coerce.date().optional(),
  manualAdjustment: z.boolean().default(false),
  adjustedBy: z.string().optional(),
});

export type CreateShiftDto = z.infer<typeof createShiftSchema>;
