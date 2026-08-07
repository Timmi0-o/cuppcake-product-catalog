import { z } from 'zod';

export const loginPayloadSchema = z.object({
  email: z.email(),
  password: z.string().min(1).max(128),
});

export type LoginPayload = z.infer<typeof loginPayloadSchema>;
