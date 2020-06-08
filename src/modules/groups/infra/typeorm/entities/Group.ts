import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
  OneToMany,
  JoinTable,
} from 'typeorm';

import User from '@modules/users/infra/typeorm/entities/User';
import GroupMember from './GroupMember';

@Entity('group')
class Group {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @Column()
  admin_id: string;

  @ManyToOne(() => User)
  @JoinColumn({ name: 'admin_id' })
  admin: User;

  @Column()
  min_value: number;

  @Column()
  max_value: number;

  @Column()
  draw_date: Date;

  @Column()
  reveal_date: Date;

  @Column({ default: 'A' }) // TODO: Expose status description
  status: string;

  @OneToMany(() => GroupMember, groupMember => groupMember.group, {
    eager: true,
  })
  @JoinTable()
  members: Promise<GroupMember[]>;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;
}

export default Group;
