/* eslint-disable @typescript-eslint/no-explicit-any */

import { IAuth } from './auth.interface';
import { createAuth } from './auth';
import {
  CognitoIdentityProviderClient,
  InitiateAuthCommand,
  SignUpCommand,
} from '@aws-sdk/client-cognito-identity-provider';
import { createHmac, handleAwsException } from '../utils';

jest.mock('@aws-sdk/client-cognito-identity-provider');
jest.mock('../utils');

describe('Auth', () => {
  let auth: IAuth;

  beforeEach(() => {
    auth = createAuth({
      aws: {
        cognito: {
          clientId: 'mock-client-id',
          clientSecret: 'mock-client-secret',
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

  describe('validate', () => {
    it('Method not implemented.', async () => {
      const token = '';

      await expect(auth.validate(token)).rejects.toThrow(
        'Method not implemented.',
      );
    });
  });
});
