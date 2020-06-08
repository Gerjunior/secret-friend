import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  JoinColumn,
  ManyToOne,
} from 'typeorm';

import User from '@modules/users/infra/typeorm/entities/User';
import Group from '@modules/groups/infra/typeorm/entities/Group';

@Entity('group_secret_friend')
class GroupSecretFriend {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  group_id: string;

  @ManyToOne(() => Group)
  @JoinColumn({ name: 'group_id' })
  group: Group;

  @Column()
  user_id: string;

  @ManyToOne(() => User)
  @JoinColumn({ name: 'user_id' })
  user: User;

  @Column()
  secret_friend_id: string;

  @ManyToOne(() => User)
  @JoinColumn({ name: 'secret_friend_id' })
  secret_friend: User;

  @CreateDateColumn()
  draw_date: Date;
}

export default GroupSecretFriend;
