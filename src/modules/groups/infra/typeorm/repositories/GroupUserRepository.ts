import { Repository, getRepository } from 'typeorm';

import IGroupUsersRepository from '@modules/groups/repositories/IGroupUsersRepository';

import GroupUser from '../entities/GroupUser';

class GroupUserRepository implements IGroupUsersRepository {
  private ormRepository: Repository<GroupUser>;

  constructor() {
    this.ormRepository = getRepository(GroupUser);
  }

  async findByGroupId(group_id: string): Promise<GroupUser[] | undefined> {
    const usersInGroup = await this.ormRepository.find({ where: { group_id } });

    return usersInGroup;
  }

  async findByUserId(user_id: string): Promise<GroupUser[] | undefined> {
    const groupsWhichIsMember = this.ormRepository.find({ where: { user_id } });

    return groupsWhichIsMember;
  }

  async findByUserAndGroupIds(
    group_id: string,
    user_id: string,
  ): Promise<GroupUser | undefined> {
    const groupUser = await this.ormRepository.findOne({
      where: { group_id, user_id },
    });

    return groupUser;
  }

  async addMember(
    group_id: string,
    user_id: string,
  ): Promise<GroupUser | undefined> {
    const groupUser = await this.ormRepository.create({ group_id, user_id });

    await this.ormRepository.save(groupUser);

    return groupUser;
  }

  async removeMember(group_id: string, user_id: string): Promise<boolean> {
    const removeResult = await this.ormRepository.delete({ group_id, user_id });

    return !!removeResult.affected;
  }

  async removeAllMembers(group_id: string): Promise<boolean> {
    const removeResult = await this.ormRepository.delete({ group_id });

    return !!removeResult.affected;
  }
}

export default GroupUserRepository;
