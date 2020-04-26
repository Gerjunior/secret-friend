import { compare } from 'bcrypt';
import { sign } from 'jsonwebtoken';

import UsersRepository from '../repositories/UsersRepository';
import AppError from '../errors/AppError';

interface IRequest {
  nickname: string;
  password: string;
}

interface IResponse {
  token: string;
}

class AuthenticateUserService {
  private usersRepository: UsersRepository;

  constructor(usersRepository: UsersRepository) {
    this.usersRepository = usersRepository;
  }

  public async execute({ nickname, password }: IRequest): Promise<IResponse> {
    const user = await this.usersRepository.FindUserByNickname(nickname);

    if (!user) {
      throw new AppError('Wrong nickname/password combination.', 400);
    }

    const passwordMatched = await compare(password, user.password);

    if (!passwordMatched) {
      throw new AppError('Wrong nickname/password combination.', 400);
    }

    const token = sign({}, process.env.jwtSecret, {
      subject: user.id,
      expiresIn: process.env.jwtExpiresIn,
    });

    return {
      token,
    };
  }
}

export default AuthenticateUserService;
