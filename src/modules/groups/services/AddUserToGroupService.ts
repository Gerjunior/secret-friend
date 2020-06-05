import { injectable, inject } from 'tsyringe';

import IGroupRepository from '@modules/groups/repositories/IGroupsRepository';
import IGroupMembersRepository from '@modules/groups/repositories/IGroupMembersRepository';
import IUsersRepository from '@modules/users/repositories/IUsersRepository';

import { Status } from '@modules/groups/entities/IGroup';
import IGroupMembers from '@modules/groups/entities/IGroupMembers';

import AppError from '@shared/errors/AppError';

interface IRequest {
  group_id: string;
  user_nickname: string;
}

@injectable()
export default class AddUserToGroupService {
  constructor(
    @inject('UsersRepository')
    private usersRepository: IUsersRepository,

    @inject('GroupsRepository')
    private groupsRepository: IGroupRepository,

    @inject('GroupMembersRepository')
    private groupMembersRepository: IGroupMembersRepository,
  ) {}

  public async execute({
    group_id,
    user_nickname,
  }: IRequest): Promise<IGroupMembers[]> {
    const group = await this.groupsRepository.findById(group_id);

    if (!group) {
      throw new AppError('Group not found.', 404);
    }

    const user = await this.usersRepository.findByNickname(user_nickname);

    if (!user) {
      throw new AppError('No user with this nickname was found.', 404);
    }

    const isMemberAlready = group.members.some(
      member => member.nickname === user_nickname,
    );

    if (isMemberAlready) {
      throw new AppError('User already member of this group.', 400);
    }

    if (group.status !== Status.Awaiting) {
      throw new AppError(
        'You cannot join this group because the draw has already been carried out.',
        400,
      );
    }

    const updatedGroup = await this.groupMembersRepository.addMember({
      group_id,
      user_id: user._id,
      name: user.name,
      last_name: user.last_name,
      nickname: user.nickname,
      email: user.email,
      birth_date: user.birth_date,
      description: user.description,
    });

    if (!updatedGroup) {
      throw new AppError(
        'An unexpected error happened while trying to add a user to the group. Please try again later.',
        400,
      );
    }

    return updatedGroup.members;
  }
}
