import { injectable, inject } from 'tsyringe';

import IUsersRepository from '@modules/users/repositories/IUsersRepository';

import AppError from '@shared/errors/AppError';
import IHashProvider from '@shared/container/providers/HashProvider/models/IHashProvider';

interface IRequest {
  id: string;
  name: string;
  last_name: string;
  password: string;
  birth_date: Date;
  description: string;
}

interface IResponse {
  id: string;
  name: string;
  last_name: string;
  nickname: string;
  email: string;
  birth_date: Date;
  description: string;
}

@injectable()
export default class UpdateUserService {
  constructor(
    @inject('HashProvider')
    private hashProvider: IHashProvider,

    @inject('UsersRepository')
    private usersRepository: IUsersRepository,
  ) {}

  public async execute({
    id,
    name,
    last_name,
    password,
    birth_date,
    description,
  }: IRequest): Promise<IResponse> {
    const user = await this.usersRepository.findById(id);

    if (!user) {
      throw new AppError('User not found.', 404);
    }

    const compare_passwords = this.hashProvider.compare(
      password,
      user.password,
    );

    const updated_password = compare_passwords
      ? user.password
      : await this.hashProvider.hash(password);

    const updatedUser = await this.usersRepository.update({
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

    return {
      id,
      name,
      last_name,
      nickname: user.nickname,
      email: user.email,
      description,
      birth_date,
    };
  }
}
