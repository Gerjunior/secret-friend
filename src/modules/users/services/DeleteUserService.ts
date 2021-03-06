import { injectable, inject } from 'tsyringe';

import IUserRepository from '@modules/users/repositories/IUserRepository';

import AppError from '@shared/errors/AppError';

@injectable()
export default class DeleteUserService {
  constructor(
    @inject('UserRepository')
    private userRepository: IUserRepository,
  ) {}

  public async execute(id: string): Promise<boolean> {
    const user = await this.userRepository.findById(id);

    if (!user) {
      throw new AppError('User not found.', 404);
    }

    return this.userRepository.delete(id);
  }
}
