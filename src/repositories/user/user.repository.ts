import { AbstractRepository } from '../abstract.repository';
import { IUserRepository } from './user-repository.interface';

export const createUserRepository = () => {
  return new UserRepository();
};

class UserRepository
  extends AbstractRepository<any>
  implements IUserRepository
{
  constructor() {
    super();
  }
}
