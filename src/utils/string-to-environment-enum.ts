import { EnvironmentEnum } from '../enums';
import { ValueNotIncludedInMap } from '../exceptions';

export const stringToEnvironmentEnum = (value: string): EnvironmentEnum => {
  const mapper: { [value: string]: EnvironmentEnum } = {
    test: EnvironmentEnum.TEST,
    development: EnvironmentEnum.DEVELOPMENT,
  };

  if (mapper[value]) {
    return mapper[value];
  }

  throw new ValueNotIncludedInMap({ value });
};
