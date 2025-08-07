import { UserRoleEnum } from '../enums';
import { ValueNotIncludedInMap } from '../exceptions';

export const stringToUserRoleEnum = (value: string): UserRoleEnum => {
  const mapper: { [value: string]: UserRoleEnum } = {
    admin: UserRoleEnum.ADMIN,
    usuário: UserRoleEnum.USER,
  };
  if (mapper[value]) {
    return mapper[value];
  }

  throw new ValueNotIncludedInMap({ value });
};
