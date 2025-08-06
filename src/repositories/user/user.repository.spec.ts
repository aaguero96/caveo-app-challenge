import { createUserRepository } from './user.repository';
import { IUserRepository } from './user-repository.interface';

describe('AbstractRepository', () => {
  let repository: IUserRepository;

  beforeEach(() => {
    repository = createUserRepository();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('create', () => {
    it('Method not implemented.', async () => {
      await expect(repository.create()).rejects.toThrow(
        'Method not implemented.',
      );
    });
  });

  describe('findOne', () => {
    it('Method not implemented.', async () => {
      await expect(repository.findOne()).rejects.toThrow(
        'Method not implemented.',
      );
    });
  });

  describe('find', () => {
    it('Method not implemented.', async () => {
      await expect(repository.find()).rejects.toThrow(
        'Method not implemented.',
      );
    });
  });

  describe('update', () => {
    it('Method not implemented.', async () => {
      await expect(repository.update()).rejects.toThrow(
        'Method not implemented.',
      );
    });
  });
});
