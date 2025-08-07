import dotenv from 'dotenv';
import { EnvironmentEnum } from '../enums';
import { z } from 'zod';

export const createEnvConfig = (): EnvConfig => {
  return new EnvConfig();
};

const envSchema = z.object({
  NODE_ENV: z.enum([EnvironmentEnum.DEVELOPMENT, EnvironmentEnum.TEST]),
  PORT: z.coerce.number().default(3000),
  DATABASE_HOST: z.string().default('localhost'),
  DATABASE_PORT: z.coerce.number().default(5432),
  DATABASE_USERNAME: z.string().default('test'),
  DATABASE_PASSWORD: z.string().default('test'),
  DATABASE_NAME: z.string().default('test'),
  DATABASE_SSL: z.coerce.boolean().default(false),
  AWS_COGNITO_REGION: z.string().default(''),
  AWS_COGNITO_CLIENT_ID: z.string().default(''),
  AWS_COGNITO_CLIENT_SECRET: z.string().default(''),
  AWS_COGNITO_TOKEN_SIGNING_KEY_URL: z.string().default(''),
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
    cognito: {
      region: string;
      clientId: string;
      clientSecret: string;
      tokenSigningKeyUrl: string;
    };
  };

  constructor() {
    dotenv.config({
      path: process.env['NODE_ENV']
        ? `.env.${process.env['NODE_ENV']}`
        : '.env',
    });

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
      cognito: {
        region: env['AWS_COGNITO_REGION'],
        clientId: env['AWS_COGNITO_CLIENT_ID'],
        clientSecret: env['AWS_COGNITO_CLIENT_SECRET'],
        tokenSigningKeyUrl: env['AWS_COGNITO_TOKEN_SIGNING_KEY_URL'],
      },
    };
  }
}
