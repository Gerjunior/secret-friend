import { Request, Response } from 'express';
import cleanDeep from 'clean-deep';
import isNumber from 'is-number';
import { container } from 'tsyringe';

import GetUserByNicknameService from '@modules/users/services/GetUserByNicknameService';
import CreateUserService from '@modules/users/services/CreateUserService';
import UpdateUserService from '@modules/users/services/UpdateUserService';

import AppError from '@shared/errors/AppError';

import userSchema from '@modules/users/infra/mongoose/schemas/Users';

export default class UsersController {
  public async getAll(request: Request, response: Response): Promise<Response> {
    const { page } = request.query;
    const { name, email, nickname } = request.body;

    const convertedPage = isNumber(page) ? Number(page) : 1;

    const users = await userSchema.paginate(
      cleanDeep({ nickname, name, email }),
      { page: convertedPage, limit: 10 },
    );

    if (users.docs.length === 0) {
      throw new AppError('No users found with those parameters.', 404);
    }

    return response.json(users);
  }

  public async getByNickname(
    request: Request,
    response: Response,
  ): Promise<Response> {
    const { nickname } = request.params;

    const getUserByNickname = container.resolve(GetUserByNicknameService);

    const user = await getUserByNickname.execute(nickname);

    return response.json(user);
  }

  public async create(request: Request, response: Response): Promise<Response> {
    const {
      name,
      last_name,
      email,
      birth_date,
      nickname,
      password,
      description,
    } = request.body;

    const createUser = container.resolve(CreateUserService);

    const user = await createUser.execute({
      name,
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
    const { id } = request.params;

    const { name, last_name, birth_date, password, description } = request.body;

    const updateUser = container.resolve(UpdateUserService);

    const user = await updateUser.execute({
      id,
      name,
      last_name,
      password,
      birth_date,
      description,
    });

    return response.json(user);
  }

  public async delete(request: Request, response: Response): Promise<Response> {
    const { id } = request.params;

    const deleted = await userSchema.findByIdAndDelete(id);

    if (!deleted) {
      throw new AppError('No user with this id was found.', 404);
    }

    await userSchema.updateMany({}, { $pull: { friends: { _id: id } } });

    return response.status(204).send();
  }
}
