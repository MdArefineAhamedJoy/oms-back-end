import { z } from 'zod';

export const paginationSchema = z.object({
  page: z.coerce.number().min(1).optional().default(1),
  limit: z.coerce.number().min(1).max(100).optional().default(10),
  sort: z.string().optional(),
  order: z.enum(['asc', 'desc']).optional().default('desc'),
});

export type PaginationDto = z.infer<typeof paginationSchema>;

export const idParamSchema = z.object({
  id: z.string().min(1),
});

export type IdParamDto = z.infer<typeof idParamSchema>;
