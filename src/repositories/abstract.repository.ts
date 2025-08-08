import {
  DeepPartial,
  EntityManager,
  FindOptionsOrder,
  FindOptionsWhere,
  ObjectLiteral,
  Repository,
  FindManyOptions,
} from 'typeorm';
import { QueryDeepPartialEntity } from 'typeorm/query-builder/QueryPartialEntity.js';

export abstract class AbstractRepository<T extends ObjectLiteral> {
  constructor(protected readonly _repository: Repository<T>) {}

  create = async (
    data: DeepPartial<T>,
    options?:
      | {
          manager?: EntityManager | undefined;
        }
      | undefined,
  ): Promise<T> => {
    const fnExec = async (entityManager: EntityManager) => {
      const entity = entityManager.create(this._repository.target, data);

      const response = await entityManager.save(
        this._repository.target,
        entity,
      );

      return response;
    };

    return fnExec(options?.manager || this._repository.manager);
  };

  findOne = async (
    where: FindOptionsWhere<T>,
    options?:
      | {
          manager?: EntityManager | undefined;
          order?: FindOptionsOrder<T> | undefined;
        }
      | undefined,
  ): Promise<T | null> => {
    const fnExec = async (entityManager: EntityManager) => {
      let order: FindOptionsOrder<T> = {};
      if (options?.order) {
        order = options?.order;
      }

      const response = await entityManager.findOne(this._repository.target, {
        where,
        order,
      });

      return response;
    };

    return fnExec(options?.manager || this._repository.manager);
  };

  find = async (
    where: FindOptionsWhere<T>,
    options?:
      | {
          manager?: EntityManager | undefined;
          order?: FindOptionsOrder<T> | undefined;
        }
      | undefined,
  ): Promise<T[]> => {
    const fnExec = async (entityManager: EntityManager) => {
      let order: FindOptionsOrder<T> = {};
      if (options?.order) {
        order = options?.order;
      }

      const response = await entityManager.find(this._repository.target, {
        where,
        order,
      });

      return response;
    };

    return fnExec(options?.manager || this._repository.manager);
  };

  update = async (
    id: string,
    data: QueryDeepPartialEntity<T>,
    options?:
      | {
          manager?: EntityManager | undefined;
        }
      | undefined,
  ): Promise<void> => {
    const fnExec = async (entityManager: EntityManager) => {
      if ('updatedAt' in data) {
        data.updatedAt = new Date();
      }
      await entityManager.update(this._repository.target, id, data);
    };

    await fnExec(options?.manager || this._repository.manager);
  };

  findAndCount = async (
    where: FindOptionsWhere<T>,
    options?:
      | {
          manager?: EntityManager | undefined;
          order?: FindOptionsOrder<T> | undefined;
          skip?: number | undefined;
          take?: number | undefined;
        }
      | undefined,
  ): Promise<{
    data: T[];
    count: number;
  }> => {
    const fnExec = async (entityManager: EntityManager) => {
      const findOptions: FindManyOptions<T> = {};

      if (options?.order) {
        findOptions.order = options.order;
      }
      if (options?.take) {
        findOptions.take = options.take;
      }
      if (options?.skip) {
        findOptions.skip = options.skip;
      }

      const response = await entityManager.findAndCount(
        this._repository.target,
        findOptions,
      );

      return response;
    };

    const response = await fnExec(options?.manager || this._repository.manager);

    return {
      data: response[0],
      count: response[1],
    };
  };
}
