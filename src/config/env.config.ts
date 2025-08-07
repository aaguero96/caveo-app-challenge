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
});

export class EnvConfig {
  private _api: {
    nodeEnv: EnvironmentEnum;
    port: number;
  };
  private _database: {
    host: string;
    port: number;
    username: string;
    password: string;
    name: string;
    ssl: boolean;
  };

  constructor() {
    dotenv.config({
      path: process.env['NODE_ENV']
        ? `.env.${process.env['NODE_ENV']}`
        : '.env',
    });

    const env = envSchema.parse(process.env);

    this._api = {
      nodeEnv: env['NODE_ENV'],
      port: env['PORT'],
    };

    this._database = {
      host: env['DATABASE_HOST'],
      name: env['DATABASE_NAME'],
      password: env['DATABASE_PASSWORD'],
      port: env['DATABASE_PORT'],
      username: env['DATABASE_USERNAME'],
      ssl: env['DATABASE_SSL'],
    };
  }

  get api(): {
    nodeEnv: EnvironmentEnum;
    port: number;
  } {
    return this._api;
  }

  get database(): {
    host: string;
    port: number;
    username: string;
    password: string;
    name: string;
    ssl: boolean;
  } {
    return this._database;
  }
}
