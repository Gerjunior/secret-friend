import { uuid } from 'uuidv4';

import IUserRepository from '@modules/users/repositories/IUserRepository';

import ICreateUserDTO from '@modules/users/dtos/ICreateUserDTO';
import IUpdateUserDTO from '@modules/users/dtos/IUpdateUserDTO';

import User from '@modules/users/infra/typeorm/entities/User';

class FakeUserRepository implements IUserRepository {
  private users: User[] = [];

  async findById(user_id: string): Promise<User | undefined> {
    return this.users.find(user => user.id === user_id);
  }

  async findByEmail(user_email: string): Promise<User | undefined> {
    return this.users.find(user => user.email === user_email);
  }

  async create({
    first_name,
    last_name,
    email,
    nickname,
    password,
    birth_date,
    description,
  }: ICreateUserDTO): Promise<User> {
    const user = new User();

    Object.assign(user, {
      id: uuid(),
      first_name,
      last_name,
      email,
      nickname,
      password,
      birth_date,
      description,
      created_at: new Date(),
      updated_at: new Date(),
    });

    this.users.push(user);

    return user;
  }

  async update(user: IUpdateUserDTO): Promise<User> {
    const userIndex = this.users.findIndex(findUser => findUser.id === user.id);

    const { email, created_at, updated_at } = this.users[userIndex];

    const password = user.password
      ? user.password
      : this.users[userIndex].password;

    this.users[userIndex] = {
      ...user,
      email,
      created_at,
      updated_at,
      password,
    };

    return this.users[userIndex];
  }

  async delete(user_id: string): Promise<boolean> {
    const findIndex = this.users.findIndex(user => user.id === user_id);

    if (findIndex === -1) {
      return false;
    }

    this.users.splice(findIndex, 1);

    return true;
  }
}

export default FakeUserRepository;
