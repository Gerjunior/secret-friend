import { injectable, inject } from 'tsyringe';

import IGroupRepository from '@modules/groups/repositories/IGroupRepository';
import IGroupUsersRepository from '@modules/groups/repositories/IGroupUsersRepository';
import IUserRepository from '@modules/users/repositories/IUserRepository';

import GroupStatus from '@modules/groups/entities/enums/GroupStatus';

import AppError from '@shared/errors/AppError';

import Group from '../infra/typeorm/entities/Group';

interface IRequest {
  group_id: string;
  user_id: string;
  admin_id: string;
}

@injectable()
export default class AddUserToGroupService {
  constructor(
    @inject('UserRepository')
    private userRepository: IUserRepository,

    @inject('GroupRepository')
    private groupRepository: IGroupRepository,

    @inject('GroupUsersRepository')
    private groupUsersRepository: IGroupUsersRepository,
  ) {}

  public async execute({
    group_id,
    user_id,
    admin_id,
  }: IRequest): Promise<Group> {
    const group = await this.groupRepository.findById(group_id);

    if (!group) {
      throw new AppError('Group not found.', 404);
    }

    const admin = await this.userRepository.findById(admin_id);

    if (!admin) {
      throw new AppError('Invalid admin_id token.', 400);
    }

    if (group.admin_id !== admin_id) {
      throw new AppError(
        'You do not have permission to add members to this group.',
        403,
      );
    }

    const user = await this.userRepository.findById(user_id);

    if (!user) {
      throw new AppError('User not found.', 404);
    }

    const isMemberAlready = await this.groupUsersRepository.findByUserAndGroupIds(
      group_id,
      user_id,
    );

    if (isMemberAlready) {
      throw new AppError('User already member of this group.', 400);
    }

    if (group.status_flag !== GroupStatus.Awaiting) {
      throw new AppError(
        'You cannot join this group because the draw has already been carried out.',
        400,
      );
    }

    await this.groupUsersRepository.addMember(group_id, user_id);

    const updatedGroup = (await this.groupRepository.findById(
      group_id,
    )) as Group;

    return updatedGroup;
  }
}
