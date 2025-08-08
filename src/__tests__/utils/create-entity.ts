import {
  DeepPartial,
  EntityManager,
  EntityTarget,
  ObjectLiteral,
} from 'typeorm';

export const createEntity = async <T extends ObjectLiteral>(
  entityClass: EntityTarget<T>,
  manager: EntityManager,
  data: DeepPartial<T>,
): Promise<T> => {
  const entity = manager.create(entityClass, data);
  return manager.save(entity);
};
