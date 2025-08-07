import { UserRoleEnum } from '../enums';
import { IAuth } from './auth.interface';
import { EnvConfig } from '../config/env.config';
import {
  CognitoIdentityProviderClient,
  InitiateAuthCommand,
  SignUpCommand,
} from '@aws-sdk/client-cognito-identity-provider';
import { createHmac, handleAwsException } from '../utils';
import { AccessTokenEmptyException } from '../exceptions';

export const createAuth = (envConfig: EnvConfig): IAuth => {
  return new Auth(envConfig);
};

class Auth implements IAuth {
  private _cognitoClient: CognitoIdentityProviderClient;

  constructor(private readonly _envConfig: EnvConfig) {
    this._cognitoClient = new CognitoIdentityProviderClient({
      region: 'us-east-2',
    });
  }

  signIn = async (
    email: string,
    password: string,
  ): Promise<{ token: string; expiresIn: string }> => {
    try {
      const command = new InitiateAuthCommand({
        AuthFlow: 'USER_PASSWORD_AUTH',
        ClientId: this._envConfig.aws.cognito.clientId,
        AuthParameters: {
          USERNAME: email,
          PASSWORD: password,
          SECRET_HASH: createHmac(
            `${email}${this._envConfig.aws.cognito.clientId}`,
            this._envConfig.aws.cognito.clientSecret,
          ),
        },
      });

      const response = await this._cognitoClient.send(command);

      if (!response.AuthenticationResult?.AccessToken) {
        throw new AccessTokenEmptyException();
      }

      return {
        token: response.AuthenticationResult.AccessToken,
        expiresIn: `${response.AuthenticationResult.ExpiresIn}s`,
      };
    } catch (err) {
      const exception = handleAwsException(err);
      if (exception) {
        throw exception;
      }

      throw err;
    }
  };

  signUp = async (email: string, password: string): Promise<void> => {
    try {
      const command = new SignUpCommand({
        ClientId: this._envConfig.aws.cognito.clientId,
        Username: email,
        Password: password,
        SecretHash: createHmac(
          `${email}${this._envConfig.aws.cognito.clientId}`,
          this._envConfig.aws.cognito.clientSecret,
        ),
      });

      await this._cognitoClient.send(command);
    } catch (err) {
      const exception = handleAwsException(err);
      if (exception) {
        throw exception;
      }

      throw err;
    }
  };

  validate = async (
    token: string,
  ): Promise<{ email: string; roles: UserRoleEnum[] }> => {
    throw new Error('Method not implemented.');
  };
}
