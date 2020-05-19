import { compare } from 'bcrypt';
import { sign } from 'jsonwebtoken';
import { injectable, inject } from 'tsyringe';

import IUsersRepository from '@modules/users/repositories/IUsersRepository';
import AppError from '@shared/errors/AppError';

interface IRequest {
  nickname: string;
  password: string;
}

interface IResponse {
  token: string;
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

    const token = sign({}, process.env.jwtSecret, {
      subject: user._id,
      expiresIn: process.env.jwtExpiresIn,
    });

    return {
      token,
    };
  }
}
