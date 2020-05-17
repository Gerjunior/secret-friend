import { Request, Response } from 'express';
import { container } from 'tsyringe';

import AddFriendService from '@modules/users/services/AddFriendService';
import RemoveFriendService from '@modules/users/services/RemoveFriendService';

export default class UserFriendsController {
  public async add(request: Request, response: Response): Promise<Response> {
    const { user_nickname } = request.params;
    const nickname = request.user_nickname;

    const addFriend = container.resolve(AddFriendService);

    const user = await addFriend.execute({
      my_nickname: nickname,
      user_nickname,
    });

    return response.json(user);
  }

  public async remove(request: Request, response: Response): Promise<Response> {
    const { user_nickname } = request.params;

    const my_nickname = request.user_nickname;

    const removeFriend = container.resolve(RemoveFriendService);

    const updatedUser = await removeFriend.execute({
      my_nickname,
      user_nickname,
    });

    return response.json(updatedUser);
  }
}
