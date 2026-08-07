import { z } from 'zod';

export const registerPayloadSchema = z.object({
  email: z.email(),
  password: z.string().min(8).max(128),
});

export type RegisterPayload = z.infer<typeof registerPayloadSchema>;
