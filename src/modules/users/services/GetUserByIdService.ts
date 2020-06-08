import { injectable, inject } from 'tsyringe';

import IUserRepository from '@modules/users/repositories/IUserRepository';

import AppError from '@shared/errors/AppError';

import User from '../infra/typeorm/entities/User';

@injectable()
export default class UpdateUserService {
  constructor(
    @inject('UserRepository')
    private UserRepository: IUserRepository,
  ) {}

  public async execute(user_id: string): Promise<User> {
    const user = await this.UserRepository.findById(user_id);

    if (!user) {
      throw new AppError('User not found', 404);
    }

    return user;
  }
}
