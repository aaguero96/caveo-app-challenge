import { UserRoleEnum } from '../enums';

export interface GetMeResponseDto {
  id: string;
  name?: string | undefined;
  role: UserRoleEnum;
  isOnboarded: boolean;
  createdAt: Date;
  updatedAt?: Date | undefined;
}
