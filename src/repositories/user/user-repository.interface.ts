import { UserEntity } from '../../entities';
import { IRepository } from '../repository.interface';

export interface IUserRepository extends IRepository<UserEntity> {}
