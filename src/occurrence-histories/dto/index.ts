import { z } from 'zod';

export const createOccurrenceHistorySchema = z.object({
  originalDocumentId: z.string().min(1),
  entryNumber: z.string().optional(),
  snapshot: z.record(z.any()),
  archivedReason: z.string().optional(),
  archivedAt: z.coerce.date(),
  tenant: z.string().optional(),
  archivedBy: z.string().optional(),
});

export type CreateOccurrenceHistoryDto = z.infer<typeof createOccurrenceHistorySchema>;

export const updateOccurrenceHistorySchema = z.object({
  originalDocumentId: z.string().min(1).optional(),
  entryNumber: z.string().optional(),
  snapshot: z.record(z.any()).optional(),
  archivedReason: z.string().optional(),
  archivedAt: z.coerce.date().optional(),
  tenant: z.string().optional(),
  archivedBy: z.string().optional(),
});

export type UpdateOccurrenceHistoryDto = z.infer<typeof updateOccurrenceHistorySchema>;
