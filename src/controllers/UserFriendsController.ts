import { Request, Response } from 'express';

import AddFriendService from '../services/AddFriendService';
import RemoveFriendService from '../services/RemoveFriendService';

import UsersRepository from '../repositories/UsersRepository';

const usersRepository = new UsersRepository();

export default class UserFriendsController {
  public async add(request: Request, response: Response): Promise<Response> {
    const { user_nickname } = request.params;
    const nickname = request.user_nickname;

    const addFriend = new AddFriendService(usersRepository);

    const user = await addFriend.execute({
      my_nickname: nickname,
      user_nickname,
    });

    return response.json(user);
  }

  public async remove(request: Request, response: Response): Promise<Response> {
    const { user_nickname } = request.params;

    const my_nickname = request.user_nickname;

    const removeFriend = new RemoveFriendService(usersRepository);

    const updatedUser = await removeFriend.execute({
      my_nickname,
      user_nickname,
    });

    return response.json(updatedUser);
  }
}
