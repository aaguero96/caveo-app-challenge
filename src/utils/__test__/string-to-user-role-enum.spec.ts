import { stringToUserRoleEnum } from '..';
import { UserRoleEnum } from '../../enums';

describe('stringToUserRoleEnum', () => {
  it('error when value not in map', () => {
    const value = 'mock';

    expect(() => stringToUserRoleEnum(value)).toThrow(
      'value mock not includded in map',
    );
  });

  it('return equivalent in map', () => {
    const value = 'admin';

    expect(stringToUserRoleEnum(value)).toBe(UserRoleEnum.ADMIN);
  });
});
