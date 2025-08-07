/* eslint-disable @typescript-eslint/no-explicit-any */

import { IAuth } from './auth.interface';
import { createAuth } from './auth';
import {
  CognitoIdentityProviderClient,
  SignUpCommand,
} from '@aws-sdk/client-cognito-identity-provider';
import { createHmac } from '../utils';

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
    it('Method not implemented.', async () => {
      const email = '';
      const password = '';

      await expect(auth.signIn(email, password)).rejects.toThrow(
        'Method not implemented.',
      );
    });
  });

  describe('signUp', () => {
    it('call signup command to cognitoc client', async () => {
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
