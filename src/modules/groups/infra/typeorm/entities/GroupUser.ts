import {
  Entity,
  CreateDateColumn,
  JoinColumn,
  ManyToOne,
  PrimaryColumn,
  Column,
} from 'typeorm';

import User from '@modules/users/infra/typeorm/entities/User';
import Group from '@modules/groups/infra/typeorm/entities/Group';
import { Exclude } from 'class-transformer';

@Entity('group_user')
class GroupUser {
  @Exclude()
  @PrimaryColumn()
  group_id: string;

  @ManyToOne(() => Group, { primary: true })
  @JoinColumn({ name: 'group_id' })
  groups: Group[];

  @PrimaryColumn()
  user_id: string;

  @ManyToOne(() => User, { primary: true })
  @JoinColumn({ name: 'user_id' })
  user: User;

  @Column()
  secret_friend_id: string;

  @CreateDateColumn()
  member_since: Date;
}

export default GroupUser;
