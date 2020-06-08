import { injectable, inject } from 'tsyringe';

import IUserRepository from '@modules/users/repositories/IUserRepository';

import AppError from '@shared/errors/AppError';
import IHashProvider from '@shared/container/providers/HashProvider/models/IHashProvider';

import User from '../infra/typeorm/entities/User';

interface IRequest {
  id: string;
  name: string;
  last_name: string;
  password: string;
  birth_date: Date;
  description: string;
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
    last_name,
    password,
    birth_date,
    description,
  }: IRequest): Promise<User> {
    const user = await this.UserRepository.findById(id);

    if (!user) {
      throw new AppError('User not found.', 404);
    }

    const password_match = this.hashProvider.compare(password, user.password);

    const updated_password = password_match
      ? user.password
      : await this.hashProvider.hash(password);

    const updatedUser = await this.UserRepository.update({
      id,
      name,
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

    return updatedUser;
  }
}
