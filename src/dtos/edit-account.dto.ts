import z from 'zod';
import { UserRoleEnum } from '../enums';

export const editAccountRequestSchema = z.object({
  userId: z.uuid().optional(),
  name: z
    .string()
    .regex(
      /^[A-Za-zÀ-ÖØ-öø-ÿ]+( [A-Za-zÀ-ÖØ-öø-ÿ]+)+$/,
      'name must be at least first name + last name separated with space',
    )
    .trim()
    .uppercase()
    .optional(),
  role: z.enum(UserRoleEnum).optional(),
});

export type EditAccountRequestDto = z.infer<typeof editAccountRequestSchema>;

export interface EditAccountResponseDto {
  userId: string;
  name?: string | undefined;
  role: UserRoleEnum;
  createdAt: Date;
  updatedAt?: Date | undefined;
}
