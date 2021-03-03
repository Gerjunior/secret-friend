import { sign } from 'jsonwebtoken';
import { injectable, inject } from 'tsyringe';
import { classToClass } from 'class-transformer';

import IUserRepository from '@modules/users/repositories/IUserRepository';
import IHashProvider from '@shared/container/providers/HashProvider/models/IHashProvider';

import authConfig from '@config/auth';

import AppError from '@shared/errors/AppError';
import User from '../infra/typeorm/entities/User';

interface IRequest {
  email: string;
  password: string;
}

interface IResponse {
  token: string;
  user: User;
}

@injectable()
export default class AuthenticateUserService {
  constructor(
    @inject('UserRepository')
    private userRepository: IUserRepository,

    @inject('HashProvider')
    private hashProvider: IHashProvider,
  ) {}

  public async execute({ email, password }: IRequest): Promise<IResponse> {
    const user = await this.userRepository.findByEmail(email);

    if (!user) {
      throw new AppError('Wrong nickname/password combination.', 400);
    }

    const passwordMatched = await this.hashProvider.compare(
      password,
      user.password,
    );

    if (!passwordMatched) {
      throw new AppError('Wrong nickname/password combination.', 400);
    }

    const user_id = String(user.id);

    const { secret, expiresIn } = authConfig.jwt;

    const token = sign({}, secret, {
      subject: user_id,
      expiresIn,
    });

    return classToClass({
      token,
      user,
    });
  }
}
