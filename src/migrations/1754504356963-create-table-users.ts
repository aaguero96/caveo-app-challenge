import {
  MigrationInterface,
  QueryRunner,
  Table,
  TableColumn,
  TableIndex,
  TableUnique,
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
            primaryKeyConstraintName: 'user_id_primary_key',
          }),
          new TableColumn({
            name: 'name',
            type: 'varchar',
            isNullable: true,
          }),
          new TableColumn({
            name: 'email',
            type: 'varchar',
          }),
          new TableColumn({
            name: 'role',
            type: 'enum',
            enumName: 'user_role_enum',
            enum: ['admin', 'usuário'],
            default: `'usuário'::user_role_enum`,
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
            name: 'user_email_index',
          }),
        ],
        uniques: [
          new TableUnique({
            columnNames: ['email'],
            name: 'user_email_unique',
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

    await queryRunner.dropTable('User', true, true, true);
  }
}
