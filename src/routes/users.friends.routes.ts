import { Router } from 'express';

import AddFriendService from '../services/AddFriendService';
import RemoveFriendService from '../services/RemoveFriendService';

import UsersRepository from '../repositories/UsersRepository';

const usersRepository = new UsersRepository();

const userFriendsRouter = Router();

userFriendsRouter.post('/add/:user_nickname', async (request, response) => {
  const { user_nickname } = request.params;
  const { nickname } = request.user;

  const addFriend = new AddFriendService(usersRepository);

  const user = await addFriend.execute({
    my_nickname: nickname,
    user_nickname,
  });

  return response.json(user);
});

userFriendsRouter.post('/remove/:user_nickname', async (request, response) => {
  const { user_nickname } = request.params;

  const my_nickname = request.user.nickname;

  const removeFriend = new RemoveFriendService(usersRepository);

  const updatedUser = await removeFriend.execute({
    my_nickname,
    user_nickname,
  });

  return response.json(updatedUser);
});

export default userFriendsRouter;
