import { z } from 'zod';

export const refreshPayloadSchema = z.object({
  refreshToken: z.string().min(1),
});

export type RefreshPayload = z.infer<typeof refreshPayloadSchema>;
