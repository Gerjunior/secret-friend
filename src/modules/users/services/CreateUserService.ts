import { inject, injectable } from 'tsyringe';

import AppError from '@shared/errors/AppError';

import userSchema from '@modules/users/infra/mongoose/schemas/Users';
import IHashProvider from '@shared/container/providers/HashProvider/models/IHashProvider';
import IUsersRepository from '@modules/users/repositories/IUsersRepository';

interface IRequest {
  name: string;
  last_name: string;
  email: string;
  birth_date: Date;
  nickname: string;
  password: string;
  description: string;
}

interface IResponse {
  id: string;
  name: string;
  last_name: string;
  email: string;
  birth_date: Date;
  nickname: string;
  description: string;
}

injectable();
export default class CreateUserService {
  constructor(
    @inject('UsersRepository')
    private usersRepository: IUsersRepository,

    @inject('HashProvider')
    private hashProvider: IHashProvider,
  ) {}

  public async execute({
    name,
    last_name,
    email,
    birth_date,
    nickname,
    password,
    description,
  }: IRequest): Promise<IResponse> {
    const emailExists = await this.usersRepository.findByEmail(email);

    if (emailExists) {
      throw new AppError('This email is already registered.', 400);
    }

    const nicknameExists = await this.usersRepository.findByNickname(nickname);

    if (nicknameExists) {
      throw new AppError('This nickname is already taken.', 400);
    }

    const hashedPassword = await this.hashProvider.hash(password);

    const user = await userSchema.create({
      name,
      last_name,
      email,
      birth_date,
      nickname,
      password: hashedPassword,
      description,
    });

    return {
      id: user._id,
      name,
      last_name,
      nickname,
      email,
      description,
      birth_date,
    };
  }
}
