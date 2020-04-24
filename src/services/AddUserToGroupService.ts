import groupSchema, { IGroup, Status } from '../models/Groups';
import usersSchema from '../models/Users';

import UsersRepository from '../repositories/UsersRepository';

import AppError from '../errors/AppError';

const usersRepository = new UsersRepository();

class AddUserToGroupService {
  public async execute(
    group_id: string,
    user_nickname: string,
  ): Promise<IGroup> {
    const group = await groupSchema.findById(group_id);

    if (!group) {
      throw new AppError('Group not found.', 404);
    }

    const user = await usersRepository.FindUserByNickname(user_nickname);

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

    return updatedGroup;
  }
}

export default AddUserToGroupService;
