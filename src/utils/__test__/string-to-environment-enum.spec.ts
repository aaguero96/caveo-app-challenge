import { stringToEnvironmentEnum } from '..';
import { EnvironmentEnum } from '../../enums';

describe('stringToEnvironmentEnum', () => {
  it('error when value not in map', () => {
    const value = 'mock';

    expect(() => stringToEnvironmentEnum(value)).toThrow(
      'value mock not includded in map',
    );
  });

  it('return equivalent in map', () => {
    const value = 'development';

    expect(stringToEnvironmentEnum(value)).toBe(EnvironmentEnum.DEVELOPMENT);
  });
});
