import { z } from 'zod';

export const updateAnnouncementSchema = z.object({
  title: z.string().min(1).optional(),
  description: z.string().min(1).optional(),
  userProfile: z.string().optional(),
  tenant: z.string().optional(),
});

export type UpdateAnnouncementDto = z.infer<typeof updateAnnouncementSchema>;
