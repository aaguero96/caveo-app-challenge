import { UserRoleEnum } from '../enums';
import { IAuth } from './auth.interface';
import { EnvConfig } from '../config/env.config';
import {
  CognitoIdentityProviderClient,
  SignUpCommand,
} from '@aws-sdk/client-cognito-identity-provider';
import { createHmac } from '../utils';

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
    throw new Error('Method not implemented.');
  };

  signUp = async (email: string, password: string): Promise<void> => {
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
  };

  validate = async (
    token: string,
  ): Promise<{ email: string; roles: UserRoleEnum[] }> => {
    throw new Error('Method not implemented.');
  };
}
