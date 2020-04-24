import userSchema, { IUser } from '../models/Users';
import groupSchema from '../models/Groups';

import AppError from '../errors/AppError';

interface IRequest {
  id: string;
  name: string;
  last_name: string;
  email: string;
  nickname: string;
  birth_date: Date;
  description: string;
}

class UpdateUserService {
  public async execute({
    id,
    name,
    last_name,
    email,
    nickname,
    birth_date,
    description,
  }: IRequest): Promise<IUser> {
    const user = await userSchema.findById(id);

    if (!user) {
      throw new AppError('User not found.', 404);
    }

    if (nickname !== user.nickname) {
      throw new AppError('You cannot update your nickname (yet).', 400);
    }

    if (email !== user.email) {
      throw new AppError('You cannot update your email (yet).', 400);
    }

    const updatedUser = await userSchema.findByIdAndUpdate(
      id,
      {
        name,
        last_name,
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
      { 'friends.nickname': { $eq: nickname } },
      {
        $set: {
          'friends.$': {
            name,
            last_name,
            email,
            nickname,
            birth_date,
            description,
          },
        },
      },
    );

    await groupSchema.updateMany(
      { 'members.nickname': { $eq: nickname } },
      {
        $set: {
          'members.$': {
            name,
            last_name,
            email,
            nickname,
            birth_date,
            description,
          },
        },
      },
    );

    return updatedUser;
  }
}

export default UpdateUserService;
