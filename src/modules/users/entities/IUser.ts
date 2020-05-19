import IUserFriends from './IUserFriends';
import IUserGroups from './IUserGroups';

export default interface IUser {
  _id: any;
  name: string;
  last_name?: string;
  email: string;
  birth_date?: Date;
  nickname: string;
  password: string;
  description?: string;
  friends: [IUserFriends];
  groups: [IUserGroups];
}
