import { inject, injectable } from 'tsyringe';

import IGroupRepository from '@modules/groups/repositories/IGroupRepository';
import IGroupUsersRepository from '@modules/groups/repositories/IGroupUsersRepository';

import AppError from '@shared/errors/AppError';

interface IRequest {
  group_id: string;
  user_id: string;
}

@injectable()
export default class RemoveUserFromGroupService {
  constructor(
    @inject('GroupRepository')
    private groupRepository: IGroupRepository,

    @inject('GroupUsersRepository')
    private groupUsersRepository: IGroupUsersRepository,
  ) {}

  public async execute({ group_id, user_id }: IRequest): Promise<boolean> {
    const group = await this.groupRepository.findById(group_id);

    if (!group) {
      throw new AppError('Group not found.', 404);
    }

    const user = group.members.find(member => member.user_id === user_id);

    if (!user) {
      throw new AppError('User not member of this group.', 400);
    }

    const removedMember = await this.groupUsersRepository.removeMember(
      group_id,
      user.user_id,
    );

    if (!removedMember) {
      throw new AppError(
        'An unexpected error happened while trying to remove a user from the group. Please try again later.',
        400,
      );
    }

    return removedMember;
  }
}

// TODO: Removing the admin will result in group deletion
