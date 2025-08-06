import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { UserRoleEnum } from '../enums';

@Entity('User')
export class UserEntity {
  @PrimaryGeneratedColumn('uuid', { name: 'id' })
  id: string;

  @Column({ name: 'name', type: 'varchar', nullable: true })
  name?: string | undefined;

  @Column({ name: 'email', type: 'varchar' })
  email: string;

  @Column({
    name: 'role',
    type: 'enum',
    enumName: 'user_role_enum',
    enum: UserRoleEnum,
    default: UserRoleEnum.USER,
  })
  role: UserRoleEnum;

  @Column({ name: 'isOnboarded', type: 'boolean', default: false })
  isOnboarded: boolean;

  @CreateDateColumn({
    name: 'createdAt',
    type: 'timestamp with time zone',
    default: 'NOW()',
  })
  createdAt: Date;

  @DeleteDateColumn({
    name: 'deletedAt',
    type: 'timestamp with time zone',
    nullable: true,
  })
  deletedAt: Date | undefined;

  @UpdateDateColumn({
    name: 'updatedAt',
    type: 'timestamp with time zone',
    nullable: true,
  })
  updatedAt: Date | undefined;
}
