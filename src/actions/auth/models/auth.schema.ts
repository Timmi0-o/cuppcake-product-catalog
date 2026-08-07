import { z } from 'zod';

export const AuthLoginFormSchema = z.object({
  email: z.string().min(1).email(),
  password: z.string().min(1).max(128),
});

export type IAuthLoginForm = z.infer<typeof AuthLoginFormSchema>;

export type IAuthLoginActionInput = IAuthLoginForm;

export const AuthUserSchema = z.object({
  id: z.string(),
  email: z.string().email(),
  createdAt: z.string().optional(),
  updatedAt: z.string().optional(),
});

export const TokenPairSchema = z.object({
  accessToken: z.string(),
  refreshToken: z.string(),
});

export const AuthActionOutputSchema = z.object({
  user: AuthUserSchema,
  tokens: TokenPairSchema,
});

export type IAuthActionOutput = z.infer<typeof AuthActionOutputSchema>;

export const AuthRefreshActionInputSchema = z.object({
  refreshToken: z.string().min(1),
});

export type IAuthRefreshActionInput = z.infer<
  typeof AuthRefreshActionInputSchema
>;

export const AuthLogoutActionInputSchema = z.object({
  refreshToken: z.string().optional(),
});

export type IAuthLogoutActionInput = z.infer<
  typeof AuthLogoutActionInputSchema
>;

export const AuthLogoutActionOutputSchema = z.object({
  success: z.boolean(),
});

export type IAuthLogoutActionOutput = z.infer<
  typeof AuthLogoutActionOutputSchema
>;
