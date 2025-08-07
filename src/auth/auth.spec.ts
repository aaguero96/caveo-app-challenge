/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */

import { IAuth } from './auth.interface';
import { createAuth } from './auth';
import {
  AdminAddUserToGroupCommand,
  AdminConfirmSignUpCommand,
  CognitoIdentityProviderClient,
  InitiateAuthCommand,
  SignUpCommand,
} from '@aws-sdk/client-cognito-identity-provider';
import {
  createHmac,
  handleAwsException,
  handleJwtException,
  stringToUserRoleEnum,
} from '../utils';
import { JwksClient } from 'jwks-rsa';
import jwt from 'jsonwebtoken';
import { UserRoleEnum } from '../enums';

jest.mock('@aws-sdk/client-cognito-identity-provider');
jest.mock('../utils');
jest.mock('jsonwebtoken');
jest.mock('jwks-rsa');

describe('Auth', () => {
  let auth: IAuth;

  beforeEach(() => {
    auth = createAuth({
      aws: {
        accessKeyId: 'mock-access-key-id',
        secretAccessKey: 'mock-secret-access-key',
        cognito: {
          clientId: 'mock-client-id',
          clientSecret: 'mock-client-secret',
          tokenSigningKeyUrl: 'mock-token-signing-key-url',
          userPoolId: 'mock-user-pool-id',
        },
      },
    } as any);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('signIn', () => {
    it('success - call initiateAuthCommand command to cognito client', async () => {
      const email = 'test@test.com';
      const password = '123456';

      (
        CognitoIdentityProviderClient.prototype.send as jest.Mock
      ).mockResolvedValueOnce({
        AuthenticationResult: {
          AccessToken: 'mock-token',
          ExpiresIn: 1,
        },
      });
      (createHmac as jest.Mock).mockReturnValueOnce('mock-hmac');

      const response = await auth.signIn(email, password);

      expect(createHmac).toHaveBeenCalledWith(
        `${email}mock-client-id`,
        'mock-client-secret',
      );
      expect(InitiateAuthCommand).toHaveBeenCalledWith(
        expect.objectContaining({
          AuthFlow: 'USER_PASSWORD_AUTH',
          ClientId: 'mock-client-id',
          AuthParameters: {
            USERNAME: email,
            PASSWORD: password,
            SECRET_HASH: 'mock-hmac',
          },
        }),
      );
      expect(
        CognitoIdentityProviderClient.prototype.send as jest.Mock,
      ).toHaveBeenCalledWith(expect.any(InitiateAuthCommand));
      expect(response).toStrictEqual({
        token: 'mock-token',
        expiresIn: '1s',
      });
    });

    it('throw error when access token response is empty', async () => {
      const email = 'test@test.com';
      const password = '123456';

      (
        CognitoIdentityProviderClient.prototype.send as jest.Mock
      ).mockResolvedValueOnce({
        AuthenticationResult: {
          AccessToken: undefined,
          ExpiresIn: 1,
        },
      });
      (createHmac as jest.Mock).mockReturnValueOnce('mock-hmac');

      const response = auth.signIn(email, password);

      await expect(response).rejects.toThrow('access token is empty');
      expect(createHmac).toHaveBeenCalledWith(
        `${email}mock-client-id`,
        'mock-client-secret',
      );
      expect(InitiateAuthCommand).toHaveBeenCalledWith(
        expect.objectContaining({
          AuthFlow: 'USER_PASSWORD_AUTH',
          ClientId: 'mock-client-id',
          AuthParameters: {
            USERNAME: email,
            PASSWORD: password,
            SECRET_HASH: 'mock-hmac',
          },
        }),
      );
      expect(
        CognitoIdentityProviderClient.prototype.send as jest.Mock,
      ).toHaveBeenCalledWith(expect.any(InitiateAuthCommand));
    });

    it('throw generic error when cognito send was failed', async () => {
      const email = 'test@test.com';
      const password = '123456';

      (
        CognitoIdentityProviderClient.prototype.send as jest.Mock
      ).mockRejectedValueOnce(new Error('mock-hmac-error'));
      (createHmac as jest.Mock).mockReturnValueOnce('mock-hmac');

      await expect(auth.signIn(email, password)).rejects.toThrow(
        'mock-hmac-error',
      );
    });

    it('throw aws error when cognito send was failed', async () => {
      const email = 'test@test.com';
      const password = '123456';

      (
        CognitoIdentityProviderClient.prototype.send as jest.Mock
      ).mockRejectedValueOnce(new Error('mock-aws-error'));
      (handleAwsException as jest.Mock).mockReturnValueOnce(
        new Error('mock-handle-aws-error'),
      );
      (createHmac as jest.Mock).mockReturnValueOnce('mock-hmac');

      await expect(auth.signIn(email, password)).rejects.toThrow(
        'mock-handle-aws-error',
      );
    });
  });

  describe('signUp', () => {
    it('success - call signup command to cognito client', async () => {
      const email = 'test@test.com';
      const password = '123456';

      (
        CognitoIdentityProviderClient.prototype.send as jest.Mock
      ).mockResolvedValueOnce({});
      (createHmac as jest.Mock).mockReturnValueOnce('mock-hmac');

      await auth.signUp(email, password);

      expect(createHmac).toHaveBeenCalledWith(
        `${email}mock-client-id`,
        'mock-client-secret',
      );
      expect(SignUpCommand).toHaveBeenCalledWith(
        expect.objectContaining({
          ClientId: 'mock-client-id',
          Username: email,
          Password: password,
          SecretHash: 'mock-hmac',
        }),
      );
      expect(
        CognitoIdentityProviderClient.prototype.send as jest.Mock,
      ).toHaveBeenCalledWith(expect.any(SignUpCommand));
    });

    it('throw generic error when cognito send was failed', async () => {
      const email = 'test@test.com';
      const password = '123456';

      (
        CognitoIdentityProviderClient.prototype.send as jest.Mock
      ).mockRejectedValueOnce(new Error('mock-hmac-error'));
      (createHmac as jest.Mock).mockReturnValueOnce('mock-hmac');

      await expect(auth.signUp(email, password)).rejects.toThrow(
        'mock-hmac-error',
      );
    });

    it('throw aws error when cognito send was failed', async () => {
      const email = 'test@test.com';
      const password = '123456';

      (
        CognitoIdentityProviderClient.prototype.send as jest.Mock
      ).mockRejectedValueOnce(new Error('mock-aws-error'));
      (handleAwsException as jest.Mock).mockReturnValueOnce(
        new Error('mock-handle-aws-error'),
      );
      (createHmac as jest.Mock).mockReturnValueOnce('mock-hmac');

      await expect(auth.signUp(email, password)).rejects.toThrow(
        'mock-handle-aws-error',
      );
    });
  });

  describe('decodeToken', () => {
    it('throw error when has error in getSigningKey from client', async () => {
      const token = 'mock-token';

      const mockGetKey = (
        JwksClient.prototype.getSigningKey as jest.Mock
      ).mockImplementationOnce((_header, cb) => {
        cb(new Error('mock-error'));
      });
      (jwt.verify as jest.Mock).mockImplementationOnce(
        (_token, getKey = mockGetKey, _options, callback) => {
          getKey({}, (err, _key) => {
            callback(err);
          });
        },
      );

      await expect(auth.decodeToken(token)).rejects.toThrow('mock-error');
    });

    it('throw error when jwt.verify callback has error', async () => {
      const token = 'mock-token';

      const mockGetKey = (
        JwksClient.prototype.getSigningKey as jest.Mock
      ).mockImplementationOnce((_header, cb) => {
        cb(null, {
          getPublicKey() {
            return 'mock-public-key';
          },
        });
      });
      (jwt.verify as jest.Mock).mockImplementationOnce(
        (_token, getKey = mockGetKey, _options, callback) => {
          getKey({}, (_err, _key) => callback(new Error('mock-error')));
        },
      );

      await expect(auth.decodeToken(token)).rejects.toThrow('mock-error');
    });

    it('throw error when cognito:groups is not an array', async () => {
      const token = 'mock-token';

      const mockGetKey = (
        JwksClient.prototype.getSigningKey as jest.Mock
      ).mockImplementationOnce((_header, cb) => {
        cb(null, {
          getPublicKey() {
            return 'mock-public-key';
          },
        });
      });
      (jwt.verify as jest.Mock).mockImplementationOnce(
        (_token, getKey = mockGetKey, _options, callback) => {
          getKey({}, (_err, _key) =>
            callback(null, {
              'cognito:groups': 'mock-cognito-groups',
            }),
          );
        },
      );

      await expect(auth.decodeToken(token)).rejects.toThrow(
        'token has invalid format. cognito:groups is not array',
      );
    });

    it('throw error when cognito:groups is not an array of strings', async () => {
      const token = 'mock-token';

      const mockGetKey = (
        JwksClient.prototype.getSigningKey as jest.Mock
      ).mockImplementationOnce((_header, cb) => {
        cb(null, {
          getPublicKey() {
            return 'mock-public-key';
          },
        });
      });
      (jwt.verify as jest.Mock).mockImplementationOnce(
        (_token, getKey = mockGetKey, _options, callback) => {
          getKey({}, (_err, _key) =>
            callback(null, {
              'cognito:groups': [1],
            }),
          );
        },
      );

      await expect(auth.decodeToken(token)).rejects.toThrow(
        'token has invalid format. cognito:groups is not array of strings',
      );
    });

    it('throw error when username is not an string', async () => {
      const token = 'mock-token';

      const mockGetKey = (
        JwksClient.prototype.getSigningKey as jest.Mock
      ).mockImplementationOnce((_header, cb) => {
        cb(null, {
          getPublicKey() {
            return 'mock-public-key';
          },
        });
      });
      (jwt.verify as jest.Mock).mockImplementationOnce(
        (_token, getKey = mockGetKey, _options, callback) => {
          getKey({}, (_err, _key) =>
            callback(null, {
              'cognito:groups': ['mock'],
              username: 1,
            }),
          );
        },
      );

      await expect(auth.decodeToken(token)).rejects.toThrow(
        'token has invalid format. username is not string',
      );
    });

    it('throw error when token was expired', async () => {
      const token = 'mock-token';

      const mockGetKey = (
        JwksClient.prototype.getSigningKey as jest.Mock
      ).mockImplementationOnce((_header, cb) => {
        cb(new Error('mock-error'));
      });
      (jwt.verify as jest.Mock).mockImplementationOnce(
        (_token, getKey = mockGetKey, _options, callback) => {
          getKey({}, (err, _key) => {
            callback(err);
          });
        },
      );
      (handleJwtException as jest.Mock).mockReturnValueOnce(
        new Error('mock-error'),
      );

      await expect(auth.decodeToken(token)).rejects.toThrow('mock-error');
    });

    it('success - return values of decoded jwt (with roles)', async () => {
      const token = 'mock-token';

      const mockGetKey = (
        JwksClient.prototype.getSigningKey as jest.Mock
      ).mockImplementationOnce((_header, cb) => {
        cb(null, {
          getPublicKey() {
            return 'mock-public-key';
          },
        });
      });
      (jwt.verify as jest.Mock).mockImplementationOnce(
        (_token, getKey = mockGetKey, _options, callback) => {
          getKey({}, (_err, _key) =>
            callback(null, {
              'cognito:groups': ['mock'],
              username: 'mock-username',
            }),
          );
        },
      );
      (stringToUserRoleEnum as jest.Mock).mockReturnValueOnce('mock');

      const response = await auth.decodeToken(token);

      expect(response).toStrictEqual({
        roles: ['mock'],
        email: 'mock-username',
      });
    });

    it('success - return values of decoded jwt (without roles)', async () => {
      const token = 'mock-token';

      const mockGetKey = (
        JwksClient.prototype.getSigningKey as jest.Mock
      ).mockImplementationOnce((_header, cb) => {
        cb(null, {
          getPublicKey() {
            return 'mock-public-key';
          },
        });
      });
      (jwt.verify as jest.Mock).mockImplementationOnce(
        (_token, getKey = mockGetKey, _options, callback) => {
          getKey({}, (_err, _key) =>
            callback(null, {
              username: 'mock-username',
            }),
          );
        },
      );
      (stringToUserRoleEnum as jest.Mock).mockReturnValueOnce('mock');

      const response = await auth.decodeToken(token);

      expect(response).toStrictEqual({
        roles: [],
        email: 'mock-username',
      });
    });
  });

  describe('confirmUser', () => {
    it('success - call signup command to cognito client', async () => {
      const email = 'test@test.com';

      (
        CognitoIdentityProviderClient.prototype.send as jest.Mock
      ).mockResolvedValueOnce({});

      await auth.confirmUser(email);

      expect(AdminConfirmSignUpCommand).toHaveBeenCalledWith(
        expect.objectContaining({
          Username: email,
          UserPoolId: 'mock-user-pool-id',
        }),
      );
      expect(
        CognitoIdentityProviderClient.prototype.send as jest.Mock,
      ).toHaveBeenCalledWith(expect.any(AdminConfirmSignUpCommand));
    });

    it('throw generic error when cognito send was failed', async () => {
      const email = 'test@test.com';

      (
        CognitoIdentityProviderClient.prototype.send as jest.Mock
      ).mockRejectedValueOnce(new Error('mock-error'));

      await expect(auth.confirmUser(email)).rejects.toThrow('mock-error');
    });

    it('throw aws error when cognito send was failed', async () => {
      const email = 'test@test.com';

      (
        CognitoIdentityProviderClient.prototype.send as jest.Mock
      ).mockRejectedValueOnce(new Error('mock-aws-error'));
      (handleAwsException as jest.Mock).mockReturnValueOnce(
        new Error('mock-handle-aws-error'),
      );

      await expect(auth.confirmUser(email)).rejects.toThrow(
        'mock-handle-aws-error',
      );
    });
  });

  describe('addRoleToUser', () => {
    it('success - call signup command to cognito client', async () => {
      const email = 'test@test.com';
      const role = UserRoleEnum.ADMIN;

      (
        CognitoIdentityProviderClient.prototype.send as jest.Mock
      ).mockResolvedValueOnce({});

      await auth.addRoleToUser(email, role);

      expect(AdminAddUserToGroupCommand).toHaveBeenCalledWith(
        expect.objectContaining({
          Username: email,
          UserPoolId: 'mock-user-pool-id',
        }),
      );
      expect(
        CognitoIdentityProviderClient.prototype.send as jest.Mock,
      ).toHaveBeenCalledWith(expect.any(AdminAddUserToGroupCommand));
    });

    it('throw generic error when cognito send was failed', async () => {
      const email = 'test@test.com';
      const role = UserRoleEnum.ADMIN;

      (
        CognitoIdentityProviderClient.prototype.send as jest.Mock
      ).mockRejectedValueOnce(new Error('mock-error'));

      await expect(auth.addRoleToUser(email, role)).rejects.toThrow(
        'mock-error',
      );
    });

    it('throw aws error when cognito send was failed', async () => {
      const email = 'test@test.com';
      const role = UserRoleEnum.ADMIN;

      (
        CognitoIdentityProviderClient.prototype.send as jest.Mock
      ).mockRejectedValueOnce(new Error('mock-aws-error'));
      (handleAwsException as jest.Mock).mockReturnValueOnce(
        new Error('mock-handle-aws-error'),
      );

      await expect(auth.addRoleToUser(email, role)).rejects.toThrow(
        'mock-handle-aws-error',
      );
    });
  });
});
