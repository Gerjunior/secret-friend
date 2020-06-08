import { injectable, inject } from 'tsyringe';

import IGroupRepository from '@modules/groups/repositories/IGroupRepository';
import IGroupMembersRepository from '@modules/groups/repositories/IGroupMembersRepository';
import IUserRepository from '@modules/users/repositories/IUserRepository';

import GroupStatus from '@modules/groups/entities/enums/GroupStatus';

import AppError from '@shared/errors/AppError';
import Group from '../infra/typeorm/entities/Group';

interface IRequest {
  group_id: string;
  user_id: string;
}

@injectable()
export default class AddUserToGroupService {
  constructor(
    @inject('UserRepository')
    private userRepository: IUserRepository,

    @inject('GroupRepository')
    private groupRepository: IGroupRepository,

    @inject('GroupMembersRepository')
    private groupMembersRepository: IGroupMembersRepository,
  ) {}

  public async execute({ group_id, user_id }: IRequest): Promise<Group> {
    const group = await this.groupRepository.findById(group_id);

    if (!group) {
      throw new AppError('Group not found.', 404);
    }

    const user = await this.userRepository.findById(user_id);

    if (!user) {
      throw new AppError('User not found.', 404);
    }

    const isMemberAlready = await this.groupMembersRepository.findByUserAndGroupIds(
      group_id,
      user_id,
    );

    if (isMemberAlready) {
      throw new AppError('User already member of this group.', 400);
    }

    if (group.status !== GroupStatus.Awaiting) {
      throw new AppError(
        'You cannot join this group because the draw has already been carried out.',
        400,
      );
    }

    const updatedGroupMember = await this.groupMembersRepository.addMember(
      group_id,
      user_id,
    );

    if (!updatedGroupMember) {
      throw new AppError(
        'An unexpected error happened while trying to add a user to the group. Please try again later.',
        400,
      );
    }

    return group;
  }
}
