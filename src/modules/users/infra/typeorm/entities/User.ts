import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
  JoinTable,
} from 'typeorm';

import { Exclude } from 'class-transformer';

import GroupMember from '@modules/groups/infra/typeorm/entities/GroupMember';

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

  @OneToMany(() => GroupMember, groupMember => groupMember.user)
  @JoinTable()
  groups: Promise<GroupMember[]>;

  @CreateDateColumn()
  @Exclude()
  created_at: Date;

  @UpdateDateColumn()
  @Exclude()
  updated_at: Date;
}

export default User;
