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

  @Column('varchar')
  name: string;

  @Column('uuid')
  admin_id: string;

  @ManyToOne(() => User)
  @JoinColumn({ name: 'admin_id' })
  admin: User;

  @Column('decimal')
  min_value?: number;

  @Column('decimal')
  max_value?: number;

  @Column('date')
  draw_date?: Date;

  @Column('date')
  reveal_date?: Date;

  @Column({ name: 'status', default: 'A', type: 'varchar' })
  status_flag: string;

  @OneToMany(() => GroupUser, groupUser => groupUser.group)
  members?: GroupUser[];

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
