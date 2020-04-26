import { Router } from 'express';

import UsersRepository from '../repositories/UsersRepository';
import AuthenticateUserService from '../services/AuthenticateUserService';

const usersRepository = new UsersRepository();

const sessionsRouter = Router();

sessionsRouter.post('/', async (request, response) => {
  const { nickname, password } = request.body;

  const authenticateUser = new AuthenticateUserService(usersRepository);

  const { token } = await authenticateUser.execute({
    nickname,
    password,
  });

  return response.json({ token });
});

export default sessionsRouter;
