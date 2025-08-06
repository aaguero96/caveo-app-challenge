import { DataSource } from 'typeorm';
import { UserEntity } from '../../entities';
import { AbstractRepository } from '../abstract.repository';
import { IUserRepository } from './user-repository.interface';

export const createUserRepository = (
  dataSource: DataSource,
): IUserRepository => {
  return new UserRepository(dataSource);
};

class UserRepository
  extends AbstractRepository<UserEntity>
  implements IUserRepository
{
  constructor(private readonly _dataSource: DataSource) {
    super(_dataSource.getRepository(UserEntity));
  }
}
