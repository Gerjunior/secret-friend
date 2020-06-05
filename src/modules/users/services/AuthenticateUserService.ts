import { compare } from 'bcrypt';
import { sign } from 'jsonwebtoken';
import { injectable, inject } from 'tsyringe';

import IUsersRepository from '@modules/users/repositories/IUsersRepository';
import AppError from '@shared/errors/AppError';
import IUser from '../entities/IUser';

interface IRequest {
  nickname: string;
  password: string;
}

interface IResponse {
  token: string;
  user: IUser;
}

@injectable()
export default class AuthenticateUserService {
  constructor(
    @inject('UsersRepository')
    private usersRepository: IUsersRepository,
  ) {}

  public async execute({ nickname, password }: IRequest): Promise<IResponse> {
    const user = await this.usersRepository.findByNickname(nickname);

    if (!user) {
      throw new AppError('Wrong nickname/password combination.', 400);
    }

    const passwordMatched = await compare(password, user.password);

    if (!passwordMatched) {
      throw new AppError('Wrong nickname/password combination.', 400);
    }

    const user_id = String(user._id);

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
