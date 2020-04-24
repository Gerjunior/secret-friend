import usersSchema, { IUser } from '../models/Users';

import UsersRepository from '../repositories/UsersRepository';
import AppError from '../errors/AppError';

const usersRepository = new UsersRepository();

interface IRequest {
  my_nickname: string;
  user_nickname: string;
}

class RemoveFriendService {
  public async execute({
    my_nickname,
    user_nickname,
  }: IRequest): Promise<IUser> {
    const myProfile = await usersRepository.FindUserByNickname(my_nickname);
    const userProfile = await usersRepository.FindUserByNickname(user_nickname);

    if (!myProfile || !userProfile) {
      throw new AppError('No user with this nickname was found.', 404);
    }

    const areFriends =
      myProfile.friends.some(friend => friend.nickname === user_nickname) ||
      userProfile.friends.some(friend => friend.nickname === my_nickname);

    if (!areFriends) {
      throw new AppError('You are not friends.', 400);
    }

    const updatedUser = await usersSchema.findOneAndUpdate(
      { nickname: my_nickname },
      { $pull: { friends: { nickname: user_nickname } } },
      { new: true },
    );

    if (!updatedUser) {
      throw new AppError(
        'An unexpected error ocurred. Please try again later.',
        400,
      );
    }

    await usersSchema.findOneAndUpdate(
      { nickname: user_nickname },
      { $pull: { friends: { nickname: my_nickname } } },
      { new: true },
    );

    return updatedUser;
  }
}

export default RemoveFriendService;
