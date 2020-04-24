import { IUser } from '../models/Users';

import UsersRepository from '../repositories/UsersRepository';
import AppError from '../errors/AppError';

const usersRepository = new UsersRepository();

interface IRequest {
  my_nickname: string;
  user_nickname: string;
}

class AddFriendService {
  public async execute({
    my_nickname,
    user_nickname,
  }: IRequest): Promise<IUser> {
    const myProfile = await usersRepository.FindUserByNickname(my_nickname);
    const userProfile = await usersRepository.FindUserByNickname(user_nickname);

    [myProfile, userProfile].forEach(profile => {
      if (!profile) {
        throw new AppError('No user with this nickname was found.', 404);
      }
    });

    if (myProfile) {
      myProfile.friends.forEach(friend => {
        if (friend.nickname === user_nickname) {
          throw new AppError('You are already friends.', 400);
        }
      });
    }

    const updatedUser = await usersRepository.AddFriend(
      my_nickname,
      user_nickname,
    );

    if (!updatedUser) {
      throw new AppError(
        'There was an error adding this user as a friend.',
        400,
      );
    }

    await usersRepository.AddFriend(user_nickname, my_nickname);

    return updatedUser;
  }
}

export default AddFriendService;
