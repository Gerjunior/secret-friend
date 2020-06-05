import { inject, injectable } from 'tsyringe';

import IUsersRepository from '@modules/users/repositories/IUsersRepository';

import IUserFriends from '@modules/users/entities/IUserFriends';
import IUserGroups from '@modules/users/entities/IUserGroups';

import AppError from '@shared/errors/AppError';

interface IResponse {
  _id: string;
  name: string;
  last_name?: string;
  email: string;
  birth_date?: Date;
  nickname: string;
  description?: string;
  friends: [IUserFriends];
  groups: [IUserGroups];
}

@injectable()
export default class GetUserByNicknameService {
  constructor(
    @inject('UsersRepository')
    private usersRepository: IUsersRepository,
  ) {}

  public async execute(nickname: string): Promise<IResponse> {
    const user = await this.usersRepository.findByNickname(nickname);

    if (!user) {
      throw new AppError('User not found.', 404);
    }

    const {
      _id,
      name,
      last_name,
      email,
      birth_date,
      description,
      friends,
      groups,
    } = user;

    return {
      _id,
      name,
      last_name,
      email,
      birth_date,
      nickname,
      description,
      friends,
      groups,
    };
  }
}
