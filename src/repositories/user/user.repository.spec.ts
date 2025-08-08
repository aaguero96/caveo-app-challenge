/* eslint-disable @typescript-eslint/no-explicit-any */

import { createUserRepository } from './user.repository';
import { IUserRepository } from './user-repository.interface';
import { DataSource, Repository } from 'typeorm';
import { UserEntity } from '../../entities';

describe('UserRepositiory', () => {
  let mockRepository: Partial<Repository<UserEntity>>;
  let mockDataSource: Partial<DataSource>;
  let userRepository: IUserRepository;

  beforeEach(() => {
    mockRepository = {
      metadata: {
        tableName: 'User',
      } as any,
      manager: {
        create: jest.fn(),
        save: jest.fn(),
        findOne: jest.fn(),
        find: jest.fn(),
        update: jest.fn(),
        findAndCount: jest.fn(),
      } as any,
    };
    mockDataSource = {
      getRepository: jest.fn().mockReturnValue(mockRepository),
    };
    userRepository = createUserRepository(mockDataSource as DataSource);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('create', () => {
    it('create and save user', async () => {
      (mockRepository.manager?.create as jest.Mock).mockResolvedValueOnce({
        id: '1',
      });
      (mockRepository.manager?.save as jest.Mock).mockResolvedValueOnce({
        id: '1',
      });

      const response = await userRepository.create({ id: '1' });

      expect(
        (mockRepository.manager?.create as jest.Mock).mock.calls,
      ).toHaveLength(1);
      expect(
        (mockRepository.manager?.save as jest.Mock).mock.calls,
      ).toHaveLength(1);
      expect(response).toStrictEqual({ id: '1' });
    });
  });

  describe('findOne', () => {
    it('findOne user', async () => {
      (mockRepository.manager?.findOne as jest.Mock).mockResolvedValueOnce({
        id: '1',
      });

      const response = await userRepository.findOne({ id: '1' });

      expect(
        (mockRepository.manager?.findOne as jest.Mock).mock.calls,
      ).toHaveLength(1);
      expect(response).toStrictEqual({ id: '1' });
    });

    it('findOne user with order', async () => {
      (mockRepository.manager?.findOne as jest.Mock).mockResolvedValueOnce({
        id: '1',
      });

      const response = await userRepository.findOne(
        { id: '1' },
        { order: { id: 'ASC' } },
      );

      expect(
        (mockRepository.manager?.findOne as jest.Mock).mock.calls,
      ).toHaveLength(1);
      expect(response).toStrictEqual({ id: '1' });
    });
  });

  describe('find', () => {
    it('find users', async () => {
      (mockRepository.manager?.find as jest.Mock).mockResolvedValueOnce([
        {
          id: '1',
        },
        {
          id: '2',
        },
      ]);

      const response = await userRepository.find({});

      expect(
        (mockRepository.manager?.find as jest.Mock).mock.calls,
      ).toHaveLength(1);
      expect(response).toStrictEqual([
        {
          id: '1',
        },
        {
          id: '2',
        },
      ]);
    });

    it('find users with order', async () => {
      (mockRepository.manager?.find as jest.Mock).mockResolvedValueOnce([
        {
          id: '1',
        },
        {
          id: '2',
        },
      ]);

      const response = await userRepository.find({}, { order: { id: 'ASC' } });

      expect(
        (mockRepository.manager?.find as jest.Mock).mock.calls,
      ).toHaveLength(1);
      expect(response).toStrictEqual([
        {
          id: '1',
        },
        {
          id: '2',
        },
      ]);
    });
  });

  describe('update', () => {
    it('Method not implemented.', async () => {
      (mockRepository.manager?.update as jest.Mock).mockResolvedValueOnce(
        undefined,
      );

      const response = await userRepository.update('1', { id: '2' });

      expect(
        (mockRepository.manager?.update as jest.Mock).mock.calls,
      ).toHaveLength(1);
      expect(response).toBeUndefined();
    });
  });

  describe('findAndCount', () => {
    it('find users and count', async () => {
      (mockRepository.manager?.findAndCount as jest.Mock).mockResolvedValueOnce(
        [
          [
            {
              id: '1',
            },
            {
              id: '2',
            },
          ],
          2,
        ],
      );

      const response = await userRepository.findAndCount({});

      expect(
        (mockRepository.manager?.findAndCount as jest.Mock).mock.calls,
      ).toHaveLength(1);
      expect(response).toStrictEqual({
        data: [
          {
            id: '1',
          },
          {
            id: '2',
          },
        ],
        count: 2,
      });
    });

    it('find users and count with take', async () => {
      (mockRepository.manager?.findAndCount as jest.Mock).mockResolvedValueOnce(
        [
          [
            {
              id: '1',
            },
            {
              id: '2',
            },
          ],
          2,
        ],
      );

      const response = await userRepository.findAndCount({}, { take: 2 });

      expect(
        (mockRepository.manager?.findAndCount as jest.Mock).mock.calls,
      ).toHaveLength(1);
      expect(response).toStrictEqual({
        data: [
          {
            id: '1',
          },
          {
            id: '2',
          },
        ],
        count: 2,
      });
    });
  });

  it('find users and count with order', async () => {
    (mockRepository.manager?.findAndCount as jest.Mock).mockResolvedValueOnce([
      [
        {
          id: '1',
        },
        {
          id: '2',
        },
      ],
      2,
    ]);

    const response = await userRepository.findAndCount(
      {},
      { order: { id: 'ASC' } },
    );

    expect(
      (mockRepository.manager?.findAndCount as jest.Mock).mock.calls,
    ).toHaveLength(1);
    expect(response).toStrictEqual({
      data: [
        {
          id: '1',
        },
        {
          id: '2',
        },
      ],
      count: 2,
    });
  });

  it('find users and count with skip', async () => {
    (mockRepository.manager?.findAndCount as jest.Mock).mockResolvedValueOnce([
      [
        {
          id: '2',
        },
      ],
      1,
    ]);

    const response = await userRepository.findAndCount({}, { skip: 1 });

    expect(
      (mockRepository.manager?.findAndCount as jest.Mock).mock.calls,
    ).toHaveLength(1);
    expect(response).toStrictEqual({
      data: [
        {
          id: '2',
        },
      ],
      count: 1,
    });
  });
});
