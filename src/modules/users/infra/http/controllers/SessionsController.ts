import { Request, Response } from 'express';
import { container } from 'tsyringe';

import AuthenticateUserService from '@modules/users/services/AuthenticateUserService';

export default class SessionsController {
  public async create(request: Request, response: Response): Promise<Response> {
    const { nickname, password } = request.body;

    const authenticateUser = container.resolve(AuthenticateUserService);

    const { token, user } = await authenticateUser.execute({
      nickname,
      password,
    });

    return response.json({ token, user });
  }
}
