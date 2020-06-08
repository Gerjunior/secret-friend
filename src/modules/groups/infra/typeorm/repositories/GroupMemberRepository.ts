import { Repository, getRepository } from 'typeorm';

import IGroupMembersRepository from '@modules/groups/repositories/IGroupMembersRepository';

import GroupMember from '../entities/GroupMember';

class GroupMemberRepository implements IGroupMembersRepository {
  private ormRepository: Repository<GroupMember>;

  constructor() {
    this.ormRepository = getRepository(GroupMember);
  }

  async findByGroupId(group_id: string): Promise<GroupMember[] | undefined> {
    const usersInGroup = await this.ormRepository.find({ where: { group_id } });

    return usersInGroup;
  }

  async findByUserId(user_id: string): Promise<GroupMember[] | undefined> {
    const groupsWhichIsMember = this.ormRepository.find({ where: { user_id } });

    return groupsWhichIsMember;
  }

  async findByUserAndGroupIds(
    group_id: string,
    user_id: string,
  ): Promise<GroupMember | undefined> {
    const groupMember = await this.ormRepository.findOne({
      where: { group_id, user_id },
    });

    return groupMember;
  }

  async addMember(
    group_id: string,
    user_id: string,
  ): Promise<GroupMember | undefined> {
    const groupMember = await this.ormRepository.create({ group_id, user_id });

    await this.ormRepository.save(groupMember);

    return groupMember;
  }

  async removeMember(group_id: string, user_id: string): Promise<boolean> {
    const removeResult = await this.ormRepository.delete({ group_id, user_id });

    return !!removeResult.affected;
  }
}

export default GroupMemberRepository;
