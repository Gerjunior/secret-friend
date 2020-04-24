import { Router } from 'express';

import AddFriendService from '../services/AddFriendService';
import RemoveFriendService from '../services/RemoveFriendService';

import UsersRepository from '../repositories/UsersRepository';

import AppError from '../errors/AppError';

const usersRepository = new UsersRepository();

const userFriendsRouter = Router();

userFriendsRouter.get('/', async (request, response) => {
  const { nickname } = request.user;

  const user = await usersRepository.FindUserByNickname(nickname);

  if (!user) {
    throw new AppError('No user with this nickname was found.', 404);
  }

  return response.json(user.friends);
});

userFriendsRouter.post('/add/:user_nickname', async (request, response) => {
  const { user_nickname } = request.params;
  const { nickname } = request.user;

  const addFriend = new AddFriendService();

  const user = await addFriend.execute({
    my_nickname: nickname,
    user_nickname,
  });

  return response.json(user);
});

userFriendsRouter.post('/remove/:user_nickname', async (request, response) => {
  const { user_nickname } = request.params;

  const my_nickname = request.user.nickname;

  const removeFriend = new RemoveFriendService();

  const updatedUser = await removeFriend.execute({
    my_nickname,
    user_nickname,
  });

  return response.json(updatedUser);
});

export default userFriendsRouter;
