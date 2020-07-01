import { Request, Response } from 'express';
import { container } from 'tsyringe';

import CreateUserService from '@modules/users/services/CreateUserService';
import UpdateUserService from '@modules/users/services/UpdateUserService';
import GetUserByIdService from '@modules/users/services/GetUserByIdService';
import DeleteUserService from '@modules/users/services/DeleteUserService';

export default class UsersController {
  public async getById(
    request: Request,
    response: Response,
  ): Promise<Response> {
    const { id } = request.params;

    const getUserById = container.resolve(GetUserByIdService);

    const user = await getUserById.execute(id);

    return response.json(user);
  }

  public async create(request: Request, response: Response): Promise<Response> {
    const {
      first_name,
      last_name,
      email,
      birth_date,
      nickname,
      password,
      description,
    } = request.body;

    const createUser = container.resolve(CreateUserService);

    const user = await createUser.execute({
      first_name,
      last_name,
      email,
      birth_date,
      nickname,
      password,
      description,
    });

    return response.status(201).json(user);
  }

  public async update(request: Request, response: Response): Promise<Response> {
    const { id } = request.user;

    const {
      first_name,
      last_name,
      nickname,
      birth_date,
      old_password,
      password,
      password_confirmation,
      description,
    } = request.body;

    const updateUser = container.resolve(UpdateUserService);

    const user = await updateUser.execute({
      id,
      first_name,
      last_name,
      nickname,
      old_password,
      password,
      password_confirmation,
      birth_date,
      description,
    });

    return response.json(user);
  }

  public async delete(request: Request, response: Response): Promise<Response> {
    const { id } = request.user;

    const deleteUser = container.resolve(DeleteUserService);

    await deleteUser.execute(id);

    return response.status(204).send();
  }
}
