import { IUser } from '@modules/users/infra/mongoose/schemas/Users';

export default interface IUsersRepository {
  findByNickname(user_nickname: string): Promise<IUser | null>;
  findByEmail(user_email: string): Promise<IUser | null>;
}
