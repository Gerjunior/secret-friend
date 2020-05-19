import userSchema from '@modules/users/infra/mongoose/schemas/Users';

import IUser from '@modules/users/entities/IUser';

import groupSchema from '@modules/groups/infra/mongoose/schemas/Groups';
import IUsersRepository from '@modules/users/repositories/IUsersRepository';
import ICreateUserDTO from '@modules/users/dtos/ICreateUserDTO';
import IUpdateUserDTO from '@modules/users/dtos/IUpdateUserDTO';

class UsersRepository implements IUsersRepository {
  public async findById(user_id: string): Promise<IUser | undefined> {
    const user = await userSchema.findById(user_id);
    return user || undefined;
  }

  public async findByNickname(nickname: string): Promise<IUser | undefined> {
    const user = await userSchema.findOne({ nickname });
    return user || undefined;
  }

  public async findByEmail(email: string): Promise<IUser | undefined> {
    const user = await userSchema.findOne({ email });
    return user || undefined;
  }

  public async create({
    name,
    last_name,
    email,
    birth_date,
    nickname,
    password,
    description,
  }: ICreateUserDTO): Promise<IUser> {
    const user = await userSchema.create({
      name,
      last_name,
      email,
      birth_date,
      nickname,
      password,
      description,
    });

    return user;
  }

  public async update({
    id,
    name,
    last_name,
    password,
    birth_date,
    description,
  }: IUpdateUserDTO): Promise<IUser | undefined> {
    const updatedUser = await userSchema.findByIdAndUpdate(
      id,
      {
        name,
        last_name,
        password,
        birth_date,
        description,
      },
      { new: true },
    );

    await userSchema.updateMany(
      { 'friends.nickname': { $eq: id } },
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
      { 'members.nickname': { $eq: id } },
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

    return updatedUser || undefined;
  }
}

export default UsersRepository;
