import { z } from 'zod';

export const signInOrRegisterRequestSchema = z.object({
  email: z.email(),
  password: z
    .string()
    .min(8, 'password must be at least 8 characters long')
    .regex(/[0-9]/, 'password must contain at least one number')
    .regex(/[a-z]/, 'Password must contain at least one lowercase letter')
    .regex(/[A-Z]/, 'Password must contain at least one uppercase letter')
    .regex(
      /[^A-Za-z0-9]/,
      'Password must contain at least one special character',
    ),
});

export type SignInOrRegisterRequestDto = z.infer<
  typeof signInOrRegisterRequestSchema
>;

export interface SignInOrRegisterResponseDto {
  status: number;
  type: 'Bearer';
  token: string;
  expiresIn: string;
}
