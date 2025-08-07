import { DataSource } from 'typeorm';
import { EnvConfig } from './env.config';

export const createDatabaseConfig = (envConfig: EnvConfig): DatabaseConfig => {
  return new DatabaseConfig(envConfig);
};

class DatabaseConfig {
  private _dataSource: DataSource;

  constructor(private readonly _envConfig: EnvConfig) {
    this._dataSource = new DataSource({
      type: 'postgres',
      host: _envConfig.database.host,
      port: _envConfig.database.port,
      username: _envConfig.database.username,
      password: _envConfig.database.password,
      database: _envConfig.database.name,
      entities: ['src/entities/*.entity.ts'],
      migrations: ['src/migrations/**/*.ts'],
      migrationsTableName: 'Migration',
      migrationsTransactionMode: 'each',
      ssl: _envConfig.database.ssl && {
        rejectUnauthorized: false,
      },
    });
  }

  get dataSource(): DataSource {
    return this._dataSource;
  }
}
