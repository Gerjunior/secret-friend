import IUser from '@modules/users/entities/IUser';

export default interface IUserFriends {
  addFriend(
    my_nickname: string,
    user_nickname: string,
  ): Promise<IUser | undefined>;
  isFriend(my_nickname: string, user_nickname: string): Promise<boolean>;
  removeFriend(
    my_nickname: string,
    user_nickname: string,
  ): Promise<IUser | undefined>;
}
