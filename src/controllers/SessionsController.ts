import { Request, Response } from 'express';

import UsersRepository from '../repositories/UsersRepository';
import AuthenticateUserService from '../services/AuthenticateUserService';

const usersRepository = new UsersRepository();

export default class SessionsController {
  public async create(request: Request, response: Response): Promise<Response> {
    const { nickname, password } = request.body;

    const authenticateUser = new AuthenticateUserService(usersRepository);

    const { token } = await authenticateUser.execute({
      nickname,
      password,
    });

    return response.json({ token });
  }
}
