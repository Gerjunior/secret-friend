import hash from '../utils/hash';

import AppError from '../errors/AppError';

import userSchema from '../models/Users';
import UsersRepository from '../repositories/UsersRepository';

interface IRequest {
  name: string;
  last_name: string;
  email: string;
  birth_date: Date;
  nickname: string;
  password: string;
  description: string;
}

interface IResponse {
  id: string;
  name: string;
  last_name: string;
  email: string;
  birth_date: Date;
  nickname: string;
  description: string;
}

class CreateUserService {
  private usersRepository: UsersRepository;

  constructor(usersRepository: UsersRepository) {
    this.usersRepository = usersRepository;
  }

  public async execute({
    name,
    last_name,
    email,
    birth_date,
    nickname,
    password,
    description,
  }: IRequest): Promise<IResponse> {
    const emailExists = await this.usersRepository.FindUserByEmail(email);

    if (emailExists) {
      throw new AppError('This email is already registered.', 400);
    }

    const nicknameExists = await this.usersRepository.FindUserByNickname(
      nickname,
    );

    if (nicknameExists) {
      throw new AppError('This nickname is already taken.', 400);
    }

    const hashedPassword = await hash(password);

    const user = await userSchema.create({
      name,
      last_name,
      email,
      birth_date,
      nickname,
      password: hashedPassword,
      description,
    });

    return {
      id: user._id,
      name,
      last_name,
      nickname,
      email,
      description,
      birth_date,
    };
  }
}

export default CreateUserService;
