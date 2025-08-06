import { DataSource } from 'typeorm';

export const createDatabaseConfig = () => {
  return new DatabaseConfig();
};

class DatabaseConfig {
  private _dataSource: DataSource;

  constructor() {
    this._dataSource = new DataSource({
      type: 'postgres',
      host: 'localhost',
      port: 5432,
      username: 'test',
      password: 'test',
      entities: [],
      migrations: ['src/migrations/**/*.ts'],
      migrationsTableName: 'Migration',
      migrationsTransactionMode: 'each',
    });
  }

  get dataSource(): DataSource {
    return this._dataSource;
  }
}
