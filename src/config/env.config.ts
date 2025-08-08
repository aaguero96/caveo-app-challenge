import dotenv from 'dotenv';
import { EnvironmentEnum } from '../enums';
import { z } from 'zod';

export const createEnvConfig = (): EnvConfig => {
  return new EnvConfig();
};

const envSchema = z.object({
  NODE_ENV: z.enum(EnvironmentEnum).default(EnvironmentEnum.DEVELOPMENT),
  PORT: z.coerce.number().default(3000),
  DATABASE_HOST: z.string().default('localhost'),
  DATABASE_PORT: z.coerce.number().default(5432),
  DATABASE_USERNAME: z.string().default('test'),
  DATABASE_PASSWORD: z.string().default('test'),
  DATABASE_NAME: z.string().default('test'),
  DATABASE_SSL: z.coerce.boolean().default(false),
  AWS_ACCESS_KEY_ID: z.string().default(''),
  AWS_SECRET_ACCESS_KEY: z.string().default(''),
  AWS_COGNITO_REGION: z.string().default(''),
  AWS_COGNITO_CLIENT_ID: z.string().default(''),
  AWS_COGNITO_CLIENT_SECRET: z.string().default(''),
  AWS_COGNITO_TOKEN_SIGNING_KEY_URL: z.string().default(''),
  AWS_COGNITO_USER_POOL_ID: z.string().default(''),
});

export class EnvConfig {
  api: {
    nodeEnv: EnvironmentEnum;
    port: number;
  };
  database: {
    host: string;
    port: number;
    username: string;
    password: string;
    name: string;
    ssl: boolean;
  };
  aws: {
    accessKeyId: string;
    secretAccessKey: string;
    cognito: {
      region: string;
      clientId: string;
      clientSecret: string;
      tokenSigningKeyUrl: string;
      userPoolId: string;
    };
  };

  constructor() {
    dotenv.config();

    const env = envSchema.parse(process.env);

    this.api = {
      nodeEnv: env['NODE_ENV'],
      port: env['PORT'],
    };

    this.database = {
      host: env['DATABASE_HOST'],
      name: env['DATABASE_NAME'],
      password: env['DATABASE_PASSWORD'],
      port: env['DATABASE_PORT'],
      username: env['DATABASE_USERNAME'],
      ssl: env['DATABASE_SSL'],
    };

    this.aws = {
      accessKeyId: env['AWS_ACCESS_KEY_ID'],
      secretAccessKey: env['AWS_SECRET_ACCESS_KEY'],
      cognito: {
        region: env['AWS_COGNITO_REGION'],
        clientId: env['AWS_COGNITO_CLIENT_ID'],
        clientSecret: env['AWS_COGNITO_CLIENT_SECRET'],
        tokenSigningKeyUrl: env['AWS_COGNITO_TOKEN_SIGNING_KEY_URL'],
        userPoolId: env['AWS_COGNITO_USER_POOL_ID'],
      },
    };
  }
}
