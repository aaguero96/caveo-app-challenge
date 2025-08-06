import { UserRoleEnum } from '../enums';

export interface EditAccountRequestDto {
  userId?: string;
  name?: string;
  role?: UserRoleEnum;
}

export interface EditAccountResponseDto {
  userId: string;
  name: string;
  role: UserRoleEnum;
  createdAt: Date;
  updatedAt: Date;
}
