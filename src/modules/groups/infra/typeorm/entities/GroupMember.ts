import {
  Entity,
  CreateDateColumn,
  UpdateDateColumn,
  JoinColumn,
  ManyToOne,
  PrimaryColumn,
} from 'typeorm';

import User from '@modules/users/infra/typeorm/entities/User';
import Group from '@modules/groups/infra/typeorm/entities/Group';

@Entity('group_member')
class GroupMember {
  @PrimaryColumn()
  group_id: string;

  @ManyToOne(() => Group, group => group.members, { primary: true })
  @JoinColumn({ name: 'group_id' })
  group: Promise<Group>;

  @PrimaryColumn()
  user_id: string;

  @ManyToOne(() => User, user => user.groups, { primary: true })
  @JoinColumn({ name: 'user_id' })
  user: Promise<User>;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;
}

export default GroupMember;
