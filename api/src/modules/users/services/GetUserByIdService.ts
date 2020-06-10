import { injectable, inject } from 'tsyringe';
import { classToClass } from 'class-transformer';

import IUserRepository from '@modules/users/repositories/IUserRepository';

import AppError from '@shared/errors/AppError';

import User from '../infra/typeorm/entities/User';

@injectable()
export default class GetUserByIdService {
  constructor(
    @inject('UserRepository')
    private userRepository: IUserRepository,
  ) {}

  public async execute(user_id: string): Promise<User> {
    const user = await this.userRepository.findById(user_id);

    if (!user) {
      throw new AppError('User not found', 404);
    }

    return classToClass(user);
  }
}
