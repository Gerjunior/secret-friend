import { IUserFriends } from '../models/Users';

import UsersRepository from '../repositories/UsersRepository';
import AppError from '../errors/AppError';

interface IRequest {
  my_nickname: string;
  user_nickname: string;
}

class AddFriendService {
  private usersRepository: UsersRepository;

  constructor(usersRepository: UsersRepository) {
    this.usersRepository = usersRepository;
  }

  public async execute({
    my_nickname,
    user_nickname,
  }: IRequest): Promise<IUserFriends[]> {
    const myProfile = await this.usersRepository.FindUserByNickname(
      my_nickname,
    );
    const userProfile = await this.usersRepository.FindUserByNickname(
      user_nickname,
    );

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

    const updatedUser = await this.usersRepository.AddFriend(
      my_nickname,
      user_nickname,
    );

    if (!updatedUser) {
      throw new AppError(
        'There was an error adding this user as a friend.',
        400,
      );
    }

    await this.usersRepository.AddFriend(user_nickname, my_nickname);

    return updatedUser.friends;
  }
}

export default AddFriendService;
