import { injectable, inject } from 'tsyringe';

import groupSchema, {
  IGroupMembers,
  Status,
} from '@modules/groups/infra/mongoose/schemas/Groups';
import usersSchema from '@modules/users/infra/mongoose/schemas/Users';

import IUsersRepository from '@modules/users/repositories/IUsersRepository';

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
  ) {}

  public async execute({
    group_id,
    user_nickname,
  }: IRequest): Promise<IGroupMembers[]> {
    const group = await groupSchema.findById(group_id);

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

    const updatedGroup = await groupSchema.findByIdAndUpdate(
      group_id,
      {
        $push: {
          members: {
            _id: user.id,
            name: user.name,
            nickname: user.nickname,
            email: user.email,
            birth_date: user.birth_date,
            description: user.description,
            secret_friend: undefined,
            wishes: undefined,
          },
        },
      },
      { new: true },
    );

    if (!updatedGroup) {
      throw new AppError(
        'An unexpected error happened while trying to add a user to the group. Please try again later.',
        400,
      );
    }

    await usersSchema.findOneAndUpdate(
      { nickname: user_nickname },
      { $push: { groups: updatedGroup } },
    );

    return updatedGroup.members;
  }
}
