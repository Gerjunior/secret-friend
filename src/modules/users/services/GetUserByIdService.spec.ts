import { uuid } from 'uuidv4';

import AppError from '@shared/errors/AppError';

import FakeHashProvider from '@shared/container/providers/HashProvider/fakes/FakeHashProvider';
import FakeUserRepository from '../repositories/fakes/FakeUserRepository';

import CreateUserService from './CreateUserService';
import GetUserByIdService from './GetUserByIdService';

let fakeUserRepository: FakeUserRepository;
let fakeHashProvider: FakeHashProvider;
let createUser: CreateUserService;
let getUserById: GetUserByIdService;

describe('GetUserById', () => {
  beforeEach(() => {
    fakeUserRepository = new FakeUserRepository();
    fakeHashProvider = new FakeHashProvider();

    createUser = new CreateUserService(fakeUserRepository, fakeHashProvider);
    getUserById = new GetUserByIdService(fakeUserRepository);
  });

  it('should be able to find a user', async () => {
    const user = await createUser.execute({
      first_name: 'John',
      last_name: 'Doe',
      email: 'johndoe@email.com',
      password: '123',
      nickname: 'johnDoe',
      birth_date: new Date('1999-09-24'),
      description: "I'm John Doe",
    });

    const findUser = await getUserById.execute(user.id);

    expect(findUser).toEqual(user);
  });

  it('should not be able to return an unexisting user', async () => {
    await expect(getUserById.execute(uuid())).rejects.toBeInstanceOf(AppError);
  });
});
