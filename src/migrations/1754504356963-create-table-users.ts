import {
  MigrationInterface,
  QueryRunner,
  Table,
  TableColumn,
  TableIndex,
} from 'typeorm';

export class CreateTableUsers1754504356963 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
        CREATE TYPE user_role_enum AS ENUM ('admin', 'usuário');
    `);

    await queryRunner.createTable(
      new Table({
        name: 'User',
        columns: [
          new TableColumn({
            name: 'id',
            type: 'uuid',
            generationStrategy: 'uuid',
            isGenerated: true,
            isPrimary: true,
          }),
          new TableColumn({
            name: 'name',
            type: 'varchar',
            isNullable: true,
          }),
          new TableColumn({
            name: 'email',
            type: 'varchar',
            isUnique: true,
          }),
          new TableColumn({
            name: 'role',
            type: 'enum',
            isNullable: true,
            enumName: 'user_role_enum',
            enum: ['admin', 'usuário'],
          }),
          new TableColumn({
            name: 'isOnboarded',
            type: 'boolean',
            default: false,
          }),
          new TableColumn({
            name: 'createdAt',
            type: 'timestamp with time zone',
            default: 'NOW()',
          }),
          new TableColumn({
            name: 'deletedAt',
            type: 'timestamp with time zone',
            isNullable: true,
          }),
          new TableColumn({
            name: 'updatedAt',
            type: 'timestamp with time zone',
            isNullable: true,
          }),
        ],
        indices: [
          new TableIndex({
            columnNames: ['email'],
            name: 'users_email_index',
          }),
        ],
      }),
      true,
      false,
      true,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
        DROP TYPE user_role_enum
    `);
  }
}
