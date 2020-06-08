import { injectable, inject } from 'tsyringe';

import Group from '@modules/groups/infra/typeorm/entities/Group';

import AppError from '@shared/errors/AppError';

import IUserRepository from '@modules/users/repositories/IUserRepository';

import IGroupRepository from '../repositories/IGroupRepository';
import IGroupUsersRepository from '../repositories/IGroupUsersRepository';

interface IRequest {
  admin_id: string;
  group_id: string;
}

@injectable()
export default class CreateGroupService {
  constructor(
    @inject('UserRepository')
    private userRepository: IUserRepository,

    @inject('GroupRepository')
    private groupRepository: IGroupRepository,

    @inject('GroupUsersRepository')
    private groupUsersRepository: IGroupUsersRepository,
  ) {}

  public async execute({ admin_id, group_id }: IRequest): Promise<Group> {
    const admin = await this.userRepository.findById(admin_id);

    if (!admin) {
      throw new AppError('User not found.', 404);
    }

    const group = await this.groupRepository.findById(group_id);

    if (!group) {
      throw new AppError('Group not found.', 404);
    }

    if (group.admin_id !== admin_id) {
      throw new AppError('You are not allowed to delete this group.', 403);
    }

    const isDeleted = await this.groupRepository.delete(group_id);

    if (!isDeleted) {
      throw new AppError(
        'There was an error deleting the group. Please try again.',
        400,
      );
    }

    return group;
  }
}
