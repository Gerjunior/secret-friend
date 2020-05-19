import IUser from '@modules/users/entities/IUser';
import ICreateUserDTO from '@modules/users/dtos/ICreateUserDTO';
import IUpdateUserDTO from '@modules/users/dtos/IUpdateUserDTO';

export default interface IUsersRepository {
  findById(user_id: string): Promise<IUser | undefined>;
  findByNickname(user_nickname: string): Promise<IUser | undefined>;
  findByEmail(user_email: string): Promise<IUser | undefined>;
  create(data: ICreateUserDTO): Promise<IUser>;
  update(data: IUpdateUserDTO): Promise<IUser | undefined>;
}
