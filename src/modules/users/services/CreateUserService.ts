import { inject, injectable } from 'tsyringe';

import AppError from '@shared/errors/AppError';

import IHashProvider from '@shared/container/providers/HashProvider/models/IHashProvider';
import IUserRepository from '@modules/users/repositories/IUserRepository';
import ICreateUserDTO from '@modules/users/dtos/ICreateUserDTO';

import User from '../infra/typeorm/entities/User';

@injectable()
export default class CreateUserService {
  constructor(
    @inject('UserRepository')
    private UserRepository: IUserRepository,

    @inject('HashProvider')
    private hashProvider: IHashProvider,
  ) {}

  public async execute({
    first_name,
    last_name,
    email,
    birth_date,
    nickname,
    password,
    description,
  }: ICreateUserDTO): Promise<User> {
    const emailExists = await this.UserRepository.findByEmail(email);

    if (emailExists) {
      throw new AppError('This email is already registered.', 400);
    }

    const nicknameExists = await this.UserRepository.findByNickname(nickname);

    if (nicknameExists) {
      throw new AppError('This nickname is already taken.', 400);
    }

    const hashedPassword = await this.hashProvider.hash(password);

    const user = await this.UserRepository.create({
      first_name,
      last_name,
      email,
      birth_date,
      nickname,
      password: hashedPassword,
      description,
    });

    return user;
  }
}
