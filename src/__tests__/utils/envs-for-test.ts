import { EnvConfig } from '../../config';
import { EnvironmentEnum } from '../../enums';

export const createEnvsForTest = (): EnvConfig => {
  return {
    api: {
      nodeEnv: EnvironmentEnum.TEST,
      port: 3000,
    },
    database: {
      host: 'localhost',
      name: 'test',
      password: 'test',
      port: 5432,
      username: 'test',
      ssl: false,
    },
    aws: {
      accessKeyId: '',
      secretAccessKey: '',
      cognito: {
        region: '',
        clientId: '',
        clientSecret: '',
        tokenSigningKeyUrl: '',
        userPoolId: '',
      },
    },
  };
};
