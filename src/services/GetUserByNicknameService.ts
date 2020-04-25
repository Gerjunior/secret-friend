import { IUserFriends, IUserGroups } from '../models/Users';
import UsersRepository from '../repositories/UsersRepository';

import AppError from '../errors/AppError';

const usersRepository = new UsersRepository();

interface IResponse {
  id: string;
  name: string;
  last_name: string;
  email: string;
  birth_date: Date;
  nickname: string;
  description: string;
  friends: [IUserFriends];
  groups: [IUserGroups];
}

class GetUserByNicknameService {
  public async execute(nickname: string): Promise<IResponse> {
    const user = await usersRepository.FindUserByNickname(nickname);

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
      id: _id,
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

export default GetUserByNicknameService;
