import { z } from 'zod';

export const createAnnouncementSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  description: z.string().min(1, 'Description is required'),
  userProfile: z.string().optional(),
  tenant: z.string().optional(),
});

export type CreateAnnouncementDto = z.infer<typeof createAnnouncementSchema>;
