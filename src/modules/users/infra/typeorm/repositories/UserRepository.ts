import { Repository, getRepository } from 'typeorm';

import IUserRepository from '@modules/users/repositories/IUserRepository';

import ICreateUserDTO from '@modules/users/dtos/ICreateUserDTO';
import IUpdateUserDTO from '@modules/users/dtos/IUpdateUserDTO';

import User from '../entities/User';

class UserRepository implements IUserRepository {
  private ormRepository: Repository<User>;

  constructor() {
    this.ormRepository = getRepository(User);
  }

  async findById(user_id: string): Promise<User | undefined> {
    return this.ormRepository.findOne(user_id);
  }

  async findByNickname(user_nickname: string): Promise<User | undefined> {
    const user = await this.ormRepository.findOne({
      where: {
        nickname: user_nickname,
      },
    });

    return user;
  }

  async findByEmail(user_email: string): Promise<User | undefined> {
    const user = await this.ormRepository.findOne({
      where: {
        email: user_email,
      },
    });

    return user;
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
    const user = this.ormRepository.create({
      first_name,
      last_name,
      email,
      nickname,
      password,
      birth_date,
      description,
    });

    await this.ormRepository.save(user);

    return user;
  }

  update(data: IUpdateUserDTO): Promise<User | undefined> {
    return this.ormRepository.save(data);
  }

  async delete(user_id: string): Promise<boolean> {
    const deleteResult = await this.ormRepository.delete({ id: user_id });

    return !!deleteResult.affected;
  }
}

export default UserRepository;
