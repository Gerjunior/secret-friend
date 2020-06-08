import { compare } from 'bcrypt';
import { sign } from 'jsonwebtoken';
import { injectable, inject } from 'tsyringe';

import IUserRepository from '@modules/users/repositories/IUserRepository';
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
    private UserRepository: IUserRepository,
  ) {}

  public async execute({ email, password }: IRequest): Promise<IResponse> {
    const user = await this.UserRepository.findByEmail(email);

    if (!user) {
      throw new AppError('Wrong nickname/password combination.', 400);
    }

    const passwordMatched = await compare(password, user.password);

    if (!passwordMatched) {
      throw new AppError('Wrong nickname/password combination.', 400);
    }

    const user_id = String(user.id);

    const token = sign({}, process.env.jwtSecret, {
      subject: user_id,
      expiresIn: process.env.jwtExpiresIn,
    });

    return {
      token,
      user,
    };
  }
}
