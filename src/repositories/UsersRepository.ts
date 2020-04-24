import { IGroup } from '../models/Groups';
import userSchema, { IUser } from '../models/Users';

class UsersRepository {
  public async AddGroupToUser(
    group: IGroup,
    nickname: string,
  ): Promise<IUser | null> {
    const user = await userSchema.findOneAndUpdate(
      { nickname },
      { $push: { groups: group } },
    );

    return user || null;
  }

  public async FindUserByNickname(nickname: string): Promise<IUser | null> {
    const user = userSchema.findOne({ nickname });
    return user || null;
  }

  public async FindUserByEmail(email: string): Promise<IUser | null> {
    const user = userSchema.findOne({ email });
    return user || null;
  }

  public async AddFriend(
    my_nickname: string,
    user_nickname: string,
  ): Promise<IUser | null> {
    const {
      _id,
      name,
      birth_date,
      description,
      nickname,
      email,
    } = (await this.FindUserByNickname(user_nickname)) as IUser;

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

    return updatedUser || null;
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

export default UsersRepository;
