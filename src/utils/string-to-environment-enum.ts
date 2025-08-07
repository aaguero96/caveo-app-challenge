import { EnvironmentEnum } from '../enums';
import { ValueNotIncludedInMap } from '../exceptions';

export const stringToEnvironmentEnum = (value: string): EnvironmentEnum => {
  const mapper: { [value: string]: EnvironmentEnum } = {
    development: EnvironmentEnum.DEVELOPMENT,
  };

  if (mapper[value]) {
    return mapper[value];
  }

  throw new ValueNotIncludedInMap({ value });
};
