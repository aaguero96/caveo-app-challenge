export abstract class AbstractRepository<T> {
  constructor() {}

  create = async (): Promise<T> => {
    throw new Error('Method not implemented.');
  };

  findOne = async (): Promise<T> => {
    throw new Error('Method not implemented.');
  };

  find = async (): Promise<T> => {
    throw new Error('Method not implemented.');
  };

  update = async (): Promise<void> => {
    throw new Error('Method not implemented.');
  };
}
