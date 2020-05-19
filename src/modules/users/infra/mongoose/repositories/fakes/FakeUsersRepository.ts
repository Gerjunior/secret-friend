import { uuid } from 'uuidv4';

import IUserRepository from '@modules/users/repositories/IUsersRepository';

import ICreateUserDTO from '@modules/users/dtos/ICreateUserDTO';
import IUpdateUserDTO from '@modules/users/dtos/IUpdateUserDTO';

import IUser from '@modules/users/entities/IUser';

export default class FakeUsersRepository implements IUserRepository {
  private users: IUser[] = [];

  public async findById(id: string): Promise<IUser | undefined> {
    const findUser = this.users.find(user => user._id === id);

    return findUser;
  }

  public async findByEmail(email: string): Promise<IUser | undefined> {
    const findUser = this.users.find(user => user.email === email);

    return findUser;
  }

  public async findByNickname(nickname: string): Promise<IUser | undefined> {
    const findUser = this.users.find(user => user.nickname === nickname);

    return findUser;
  }

  public async create({
    name,
    email,
    nickname,
    description,
    birth_date,
    last_name,
    password,
  }: ICreateUserDTO): Promise<IUser> {
    const user = {
      _id: uuid(),
      name,
      email,
      nickname,
      password,
      description,
      birth_date,
      last_name,
    };

    this.users.push(user);

    return user;
  }

  public async update(user: IUpdateUserDTO): Promise<IUser> {
    const findIndex = this.users.findIndex(
      findUser => findUser._id === user.id,
    );

    const findUser = this.users[findIndex];

    this.users[findIndex] = {
      _id: user.id,
      name: user.name,
      email: findUser.email,
      nickname: findUser.nickname,
      last_name: user.last_name,
      birth_date: user.birth_date,
      description: user.description,
      password: user.password,
      friends: findUser.friends,
      groups: findUser.groups,
    };

    return {
      ...user,
      _id: user.id,
      email: findUser.email,
      nickname: findUser.nickname,
    };
  }
}
