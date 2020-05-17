import { injectable, inject } from 'tsyringe';

import userSchema, { IUser } from '@modules/users/infra/mongoose/schemas/Users';
import IUserFriends from '@modules/users/repositories/IUserFriendsRepository';
import UsersRepository from './UsersRepository';

@injectable()
class UserFriendsRepository implements IUserFriends {
  constructor(
    @inject('UsersRepository')
    private usersRepository: UsersRepository,
  ) {}

  public async addFriend(
    my_nickname: string,
    user_nickname: string,
  ): Promise<IUser | undefined> {
    const {
      id: _id,
      name,
      birth_date,
      description,
      nickname,
      email,
    } = (await this.usersRepository.findByNickname(user_nickname)) as IUser;

    const updatedUser = await userSchema.findOneAndUpdate(
      { nickname: my_nickname },
      {
        $push: {
          friends: {
            _id,
            name,
            birth_date: birth_date.toString(),
            description,
            nickname,
            email,
          },
        },
      },
      { new: true },
    );

    return updatedUser || undefined;
  }

  public async isFriend(
    nickname: string,
    user_nickname: string,
  ): Promise<boolean> {
    const isAlreadyFriend = await userSchema.findOne({
      nickname,
      friends: { $elemMatch: { nickname: user_nickname } },
    });

    if (!isAlreadyFriend) {
      return false;
    }

    return true;
  }
}

export default UserFriendsRepository;
