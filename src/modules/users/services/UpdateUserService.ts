import { injectable, inject } from 'tsyringe';
import { classToClass } from 'class-transformer';

import IUserRepository from '@modules/users/repositories/IUserRepository';

import AppError from '@shared/errors/AppError';
import IHashProvider from '@shared/container/providers/HashProvider/models/IHashProvider';

import User from '../infra/typeorm/entities/User';

interface IRequest {
  id: string;
  name?: string;
  first_name?: string;
  last_name?: string;
  old_password?: string;
  password?: string;
  password_confirmation?: string;
  birth_date?: Date;
  description?: string;
}

@injectable()
export default class UpdateUserService {
  constructor(
    @inject('HashProvider')
    private hashProvider: IHashProvider,

    @inject('UserRepository')
    private UserRepository: IUserRepository,
  ) {}

  public async execute({
    id,
    name,
    first_name,
    last_name,
    old_password,
    password,
    password_confirmation,
    birth_date,
    description,
  }: IRequest): Promise<User> {
    const user = await this.UserRepository.findById(id);

    if (!user) {
      throw new AppError('User not found.', 404);
    }

    let updated_password = user.password;

    if (old_password && password && password_confirmation) {
      const password_match = this.hashProvider.compare(
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

    const updatedUser = await this.UserRepository.update({
      id,
      name,
      first_name,
      last_name,
      password: updated_password,
      birth_date,
      description,
    });

    if (!updatedUser) {
      throw new AppError(
        'There was an error trying to update your profile. Please try again later.',
        400,
      );
    }

    return classToClass(updatedUser);
  }
}
