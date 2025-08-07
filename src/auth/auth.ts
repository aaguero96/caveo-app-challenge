import { UserRoleEnum } from '../enums';
import { IAuth } from './auth.interface';
import { EnvConfig } from '../config/env.config';
import {
  AdminConfirmSignUpCommand,
  CognitoIdentityProviderClient,
  InitiateAuthCommand,
  SignUpCommand,
  AdminAddUserToGroupCommand,
} from '@aws-sdk/client-cognito-identity-provider';
import {
  createHmac,
  handleAwsException,
  handleJwtException,
  stringToUserRoleEnum,
} from '../utils';
import {
  AccessTokenEmptyException,
  TokenInvalidFormatException,
} from '../exceptions';
import jwt, { JwtHeader, SigningKeyCallback } from 'jsonwebtoken';
import { JwksClient } from 'jwks-rsa';

export const createAuth = (envConfig: EnvConfig): IAuth => {
  return new Auth(envConfig);
};

class Auth implements IAuth {
  private _cognitoClient: CognitoIdentityProviderClient;

  constructor(private readonly _envConfig: EnvConfig) {
    this._cognitoClient = new CognitoIdentityProviderClient({
      region: this._envConfig.aws.cognito.region,
      credentials: {
        accessKeyId: _envConfig.aws.accessKeyId,
        secretAccessKey: _envConfig.aws.secretAccessKey,
      },
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

  decodeToken = async (
    token: string,
  ): Promise<{ email: string; roles: UserRoleEnum[] }> => {
    try {
      const client = new JwksClient({
        jwksUri: this._envConfig.aws.cognito.tokenSigningKeyUrl,
      });

      const getKey = (header: JwtHeader, callback: SigningKeyCallback) => {
        client.getSigningKey(header?.kid, (err, key) => {
          if (err) {
            return callback(err);
          }

          callback(null, key?.getPublicKey());
        });
      };

      const issuer = this._envConfig.aws.cognito.tokenSigningKeyUrl.replace(
        '/.well-known/jwks.json',
        '',
      );

      const payload = await new Promise<jwt.JwtPayload>((resolve, reject) => {
        jwt.verify(
          token,
          getKey,
          {
            algorithms: ['RS256'],
            issuer,
          },
          (err, decoded) => {
            if (err) {
              return reject(err);
            }

            return resolve(decoded as jwt.JwtPayload);
          },
        );
      });

      const cognitoGroups = payload['cognito:groups'] || [];
      if (!Array.isArray(cognitoGroups)) {
        throw new TokenInvalidFormatException({
          reason: 'cognito:groups is not array',
        });
      } else if (
        !cognitoGroups.every((cognitoGroup) => typeof cognitoGroup === 'string')
      ) {
        throw new TokenInvalidFormatException({
          reason: 'cognito:groups is not array of strings',
        });
      }

      const email = payload['username'];
      if (typeof email !== 'string') {
        throw new TokenInvalidFormatException({
          reason: 'username is not string',
        });
      }

      const roles = cognitoGroups.map((cognitoGroup) =>
        stringToUserRoleEnum(cognitoGroup),
      );

      return { email, roles };
    } catch (err) {
      const exception = handleJwtException(err);
      if (exception) {
        throw exception;
      }

      throw err;
    }
  };

  confirmUser = async (email: string): Promise<void> => {
    try {
      const command = new AdminConfirmSignUpCommand({
        Username: email,
        UserPoolId: this._envConfig.aws.cognito.userPoolId,
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

  addRoleToUser = async (email: string, role: UserRoleEnum): Promise<void> => {
    try {
      const command = new AdminAddUserToGroupCommand({
        Username: email,
        UserPoolId: this._envConfig.aws.cognito.userPoolId,
        GroupName: role.toString(),
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
}
