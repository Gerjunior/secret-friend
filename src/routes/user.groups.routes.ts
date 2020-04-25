import { Router } from 'express';

import UsersRepository from '../repositories/UsersRepository';
import AppError from '../errors/AppError';

const usersRepository = new UsersRepository();

const userGroupsRouter = Router();

userGroupsRouter.get('/', async (request, response) => {
  const { nickname } = request.user;

  const user = await usersRepository.FindUserByNickname(nickname);

  if (!user) {
    throw new AppError('User not found.', 404);
  }

  return response.json(user.friends);
});

export default userGroupsRouter;
