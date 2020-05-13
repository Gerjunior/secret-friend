import { Request, Response } from 'express';
import cleanDeep from 'clean-deep';
import isNumber from 'is-number';

import UsersRepository from '../repositories/UsersRepository';

import GetUserByNicknameService from '../services/GetUserByNicknameService';
import CreateUserService from '../services/CreateUserService';
import UpdateUserService from '../services/UpdateUserService';

import AppError from '../errors/AppError';

import userSchema from '../models/Users';

const usersRepository = new UsersRepository();

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

    const getUserByNickname = new GetUserByNicknameService();

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

    const createUser = new CreateUserService(usersRepository);

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

    const updateUser = new UpdateUserService();

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
