import {
  DeepPartial,
  EntityManager,
  FindOptionsOrder,
  FindOptionsWhere,
  ObjectLiteral,
  Repository,
} from 'typeorm';
import { EntityNotFoundException } from '../exceptions';
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
  ): Promise<T> => {
    const fnExec = async (entityManager: EntityManager) => {
      let order: FindOptionsOrder<T> = {};
      if (options?.order) {
        order = options?.order;
      }

      const response = await entityManager.findOne(this._repository.target, {
        where,
        order,
      });

      if (!response) {
        throw new EntityNotFoundException({
          tableName: this._repository.metadata.tableName,
        });
      }

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
      await entityManager.update(this._repository.target, id, data);
    };

    await fnExec(options?.manager || this._repository.manager);
  };
}
