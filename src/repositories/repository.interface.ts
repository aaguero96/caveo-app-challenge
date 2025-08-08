import {
  DeepPartial,
  EntityManager,
  FindOptionsOrder,
  FindOptionsWhere,
} from 'typeorm';
import { QueryDeepPartialEntity } from 'typeorm/query-builder/QueryPartialEntity.js';

export interface IRepository<T> {
  create(
    data: DeepPartial<T>,
    options?:
      | {
          manager?: EntityManager | undefined;
        }
      | undefined,
  ): Promise<T>;
  findOne(
    where: FindOptionsWhere<T>,
    options?:
      | {
          manager?: EntityManager | undefined;
          order?: FindOptionsOrder<T> | undefined;
        }
      | undefined,
  ): Promise<T | null>;
  find(
    where: FindOptionsWhere<T>,
    options?:
      | {
          manager?: EntityManager | undefined;
          order?: FindOptionsOrder<T> | undefined;
        }
      | undefined,
  ): Promise<T[]>;
  update(
    id: string,
    data: QueryDeepPartialEntity<T>,
    options?:
      | {
          manager?: EntityManager | undefined;
        }
      | undefined,
  ): Promise<void>;
  findAndCount(
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
  }>;
}
