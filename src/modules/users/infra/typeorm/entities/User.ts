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

  @Column()
  first_name: string;

  @Column()
  last_name: string;

  @Column()
  email: string;

  @Column()
  birth_date: Date;

  @Column()
  nickname: string;

  @Column()
  @Exclude()
  password: string;

  @Column()
  description: string;

  @OneToMany(() => GroupUser, groupUser => groupUser.groups)
  groups: GroupUser[];

  @CreateDateColumn()
  @Exclude()
  created_at: Date;

  @UpdateDateColumn()
  @Exclude()
  updated_at: Date;
}

export default User;
