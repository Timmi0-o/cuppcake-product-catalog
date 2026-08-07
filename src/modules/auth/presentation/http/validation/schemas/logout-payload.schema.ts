import { z } from 'zod';

export const logoutPayloadSchema = z.object({
  refreshToken: z.string().min(1).optional(),
});

export type LogoutPayload = z.infer<typeof logoutPayloadSchema>;
