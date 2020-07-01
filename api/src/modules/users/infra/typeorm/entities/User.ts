import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
} from 'typeorm';

import { Exclude } from 'class-transformer';

import GroupUser from '@modules/groups/infra/typeorm/entities/GroupUser';

@Entity('user')
class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column('varchar')
  first_name?: string;

  @Column('varchar')
  last_name?: string;

  @Column('varchar')
  email: string;

  @Column('date')
  birth_date?: Date;

  @Column('varchar')
  nickname?: string;

  @Column('varchar')
  @Exclude()
  password: string;

  @Column('varchar')
  description?: string;

  @OneToMany(() => GroupUser, groupUser => groupUser.user)
  groups?: GroupUser[];

  @CreateDateColumn()
  @Exclude()
  created_at: Date;

  @UpdateDateColumn()
  @Exclude()
  updated_at: Date;
}

export default User;
