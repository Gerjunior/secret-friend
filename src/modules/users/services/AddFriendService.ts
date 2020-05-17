import { injectable, inject } from 'tsyringe';

import { IUserFriends } from '@modules/users/infra/mongoose/schemas/Users';

import IUsersRepository from '@modules/users/repositories/IUsersRepository';
import IUserFriendsRepository from '@modules/users/repositories/IUserFriendsRepository';
import AppError from '@shared/errors/AppError';

interface IRequest {
  my_nickname: string;
  user_nickname: string;
}

@injectable()
export default class AddFriendService {
  constructor(
    @inject('UsersRepository')
    private usersRepository: IUsersRepository,

    @inject('UserFriendsRepository')
    private userFriendsRepository: IUserFriendsRepository,
  ) {}

  public async execute({
    my_nickname,
    user_nickname,
  }: IRequest): Promise<IUserFriends[]> {
    const myProfile = await this.usersRepository.findByNickname(my_nickname);
    const userProfile = await this.usersRepository.findByNickname(
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

    const updatedUser = await this.userFriendsRepository.addFriend(
      my_nickname,
      user_nickname,
    );

    if (!updatedUser) {
      throw new AppError(
        'There was an error adding this user as a friend.',
        400,
      );
    }

    await this.userFriendsRepository.addFriend(user_nickname, my_nickname);

    return updatedUser.friends;
  }
}
