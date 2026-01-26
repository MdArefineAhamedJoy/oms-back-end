import { z } from 'zod';

export const createDocumentTableSchema = z.object({
  title: z.string().optional(),
  description: z.string().optional(),
  attachment: z.array(z.string()).optional(),
  isGuard: z.boolean().default(false),
  users_permissions_user: z.string().optional(),
});

export type CreateDocumentTableDto = z.infer<typeof createDocumentTableSchema>;

export const updateDocumentTableSchema = z.object({
  title: z.string().optional(),
  description: z.string().optional(),
  attachment: z.array(z.string()).optional(),
  isGuard: z.boolean().optional(),
  users_permissions_user: z.string().optional(),
});

export type UpdateDocumentTableDto = z.infer<typeof updateDocumentTableSchema>;
