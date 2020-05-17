import { injectable, inject } from 'tsyringe';

import userSchema from '@modules/users/infra/mongoose/schemas/Users';

import groupSchema from '@modules/groups/infra/mongoose/schemas/Groups';

import AppError from '@shared/errors/AppError';
import IHashProvider from '@shared/container/providers/HashProvider/models/IHashProvider';

interface IRequest {
  id: string;
  name: string;
  last_name: string;
  password: string;
  birth_date: Date;
  description: string;
}

interface IResponse {
  id: string;
  name: string;
  last_name: string;
  nickname: string;
  email: string;
  birth_date: Date;
  description: string;
}

@injectable()
export default class UpdateUserService {
  constructor(
    @inject('HashProvider')
    private hashProvider: IHashProvider,
  ) {}

  public async execute({
    id,
    name,
    last_name,
    password,
    birth_date,
    description,
  }: IRequest): Promise<IResponse> {
    const user = await userSchema.findById(id);

    if (!user) {
      throw new AppError('User not found.', 404);
    }

    const compare_passwords = this.hashProvider.compare(
      password,
      user.password,
    );

    const updated_password = compare_passwords
      ? user.password
      : await this.hashProvider.hash(password);

    const updatedUser = await userSchema.findByIdAndUpdate(
      id,
      {
        name,
        last_name,
        password: updated_password,
        birth_date,
        description,
      },
      { new: true },
    );

    if (!updatedUser) {
      throw new AppError(
        'There was an error trying to update your profile. Please try again later.',
        400,
      );
    }

    await userSchema.updateMany(
      { 'friends.nickname': { $eq: user._id } },
      {
        $set: {
          'friends.$': {
            name,
            last_name,
            birth_date,
            description,
          },
        },
      },
    );

    await groupSchema.updateMany(
      { 'members.nickname': { $eq: user._id } },
      {
        $set: {
          'members.$': {
            name,
            last_name,
            birth_date,
            description,
          },
        },
      },
    );

    return {
      id,
      name,
      last_name,
      nickname: user.nickname,
      email: user.email,
      description,
      birth_date,
    };
  }
}
