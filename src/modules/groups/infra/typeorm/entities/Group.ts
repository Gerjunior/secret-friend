import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
  JoinColumn,
  ManyToOne,
} from 'typeorm';

import Status from '@modules/groups/entities/enums/GroupStatus';

import User from '@modules/users/infra/typeorm/entities/User';
import { Expose } from 'class-transformer';
import GroupUser from './GroupUser';

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

  @Column({ name: 'status', default: 'A' })
  status_flag: string;

  @OneToMany(() => GroupUser, groupUser => groupUser.group)
  members: GroupUser[];

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;

  @Expose({ name: 'status' })
  getStatus(): string {
    if (Status.Awaiting === this.status_flag) {
      return 'Awaiting';
    }

    if (Status.Drawn === this.status_flag) {
      return 'Drawn';
    }

    return 'Finished';
  }
}

export default Group;
