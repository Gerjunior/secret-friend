import { IUser } from '@modules/users/infra/mongoose/schemas/Users';

export default interface IUserFriends {
  addFriend(
    my_nickname: string,
    user_nickname: string,
  ): Promise<IUser | undefined>;
  isFriend(my_nickname: string, user_nickname: string): Promise<boolean>;
}
