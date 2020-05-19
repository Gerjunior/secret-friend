import { inject, injectable } from 'tsyringe';

import IGroupMembers from '@modules/groups/entities/IGroupMembers';

import IGroupRepository from '@modules/groups/repositories/IGroupsRepository';
import IGroupMembersRepository from '@modules/groups/repositories/IGroupMembersRepository';

import AppError from '@shared/errors/AppError';

interface IRequest {
  group_id: string;
  user_nickname: string;
}

@injectable()
export default class RemoveUserFromGroupService {
  constructor(
    @inject('GroupsRepository')
    private groupRepository: IGroupRepository,

    @inject('GroupMembersRepository')
    private groupMembersRepository: IGroupMembersRepository,
  ) {}

  public async execute({
    group_id,
    user_nickname,
  }: IRequest): Promise<IGroupMembers[]> {
    const group = await this.groupRepository.findById(group_id);

    if (!group) {
      throw new AppError('Group not found.', 404);
    }

    const user = group.members.find(
      member => member.nickname === user_nickname,
    );

    if (!user) {
      throw new AppError('User not member of this group.', 400);
    }

    const updatedGroup = await this.groupMembersRepository.removeMember(
      group_id,
      user._id,
    );

    if (!updatedGroup) {
      throw new AppError(
        'An unexpected error happened while trying to remove a user from the group. Please try again later.',
        400,
      );
    }

    return updatedGroup.members;
  }
}
