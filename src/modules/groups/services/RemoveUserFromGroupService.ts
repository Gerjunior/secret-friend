import { inject, injectable } from 'tsyringe';

import IGroupRepository from '@modules/groups/repositories/IGroupRepository';
import IUserRepository from '@modules/users/repositories/IUserRepository';
import IGroupUsersRepository from '@modules/groups/repositories/IGroupUsersRepository';

import AppError from '@shared/errors/AppError';

interface IRequest {
  group_id: string;
  user_id: string;
  admin_id: string;
}

@injectable()
export default class RemoveUserFromGroupService {
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
  }: IRequest): Promise<boolean> {
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
        'You do not have permission to remove members from this group.',
        403,
      );
    }

    const groupUser = await this.groupUsersRepository.findByUserAndGroupIds(
      group_id,
      user_id,
    );

    if (!groupUser) {
      throw new AppError('User not member of this group.', 400);
    }

    await this.groupUsersRepository.removeMember(group_id, user_id);

    if (admin_id === user_id) {
      await this.groupRepository.delete(group_id);
    }

    return true;
  }
}
