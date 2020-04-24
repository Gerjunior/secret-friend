import { hash } from 'bcrypt';

import AppError from '../errors/AppError';

import userSchema, { IUser } from '../models/Users';
import UsersRepository from '../repositories/UsersRepository';

const usersRepository = new UsersRepository();

interface IRequest {
  name: string;
  last_name: string;
  email: string;
  birth_date: Date;
  nickname: string;
  password: string;
  description: string;
}

class CreateUserService {
  public async execute({
    name,
    last_name,
    email,
    birth_date,
    nickname,
    password,
    description,
  }: IRequest): Promise<IUser> {
    const emailExists = await usersRepository.FindUserByEmail(email);

    if (emailExists) {
      throw new AppError('This email is already registered.', 400);
    }

    const nicknameExists = await usersRepository.FindUserByNickname(nickname);

    if (nicknameExists) {
      throw new AppError('This nickname is already taken.', 400);
    }

    const hashedPassword = await hash(password, 8);

    const user = await userSchema.create({
      name,
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

export default CreateUserService;
