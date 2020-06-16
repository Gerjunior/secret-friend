import { injectable, inject } from 'tsyringe';
import { classToClass } from 'class-transformer';

import IUserRepository from '@modules/users/repositories/IUserRepository';

import AppError from '@shared/errors/AppError';
import IHashProvider from '@shared/container/providers/HashProvider/models/IHashProvider';

import User from '../infra/typeorm/entities/User';

interface IRequest {
  id: string;
  first_name?: string;
  last_name?: string;
  nickname?: string;
  old_password?: string;
  password?: string;
  password_confirmation?: string;
  birth_date?: Date;
  description?: string;
}

@injectable()
export default class UpdateUserService {
  constructor(
    @inject('UserRepository')
    private userRepository: IUserRepository,

    @inject('HashProvider')
    private hashProvider: IHashProvider,
  ) {}

  public async execute({
    id,
    first_name,
    last_name,
    nickname,
    old_password,
    password,
    password_confirmation,
    birth_date,
    description,
  }: IRequest): Promise<User> {
    const user = await this.userRepository.findById(id);

    if (!user) {
      throw new AppError('User not found.', 404);
    }

    let updated_password = user.password;

    if (old_password && password && password_confirmation) {
      const password_match = await this.hashProvider.compare(
        old_password,
        user.password,
      );

      if (!password_match) {
        throw new AppError('Wrong password.', 400);
      }

      if (password !== password_confirmation) {
        throw new AppError(
          'Password confirmation is different from new password',
          400,
        );
      }

      updated_password = await this.hashProvider.hash(password);
    }

    const updatedUser = await this.userRepository.update({
      id,
      first_name,
      last_name,
      password: updated_password,
      birth_date,
      description,
      nickname,
    });

    return classToClass(updatedUser as User);
  }
}
