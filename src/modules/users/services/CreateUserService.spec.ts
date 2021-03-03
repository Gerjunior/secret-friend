import AppError from '@shared/errors/AppError';

import FakeHashProvider from '@shared/container/providers/HashProvider/fakes/FakeHashProvider';
import FakeUserRepository from '../repositories/fakes/FakeUserRepository';

import CreateUserService from './CreateUserService';

let fakeUserRepository: FakeUserRepository;
let hashProvider: FakeHashProvider;
let createUser: CreateUserService;

describe('CreateUser', () => {
  beforeEach(() => {
    fakeUserRepository = new FakeUserRepository();
    hashProvider = new FakeHashProvider();

    createUser = new CreateUserService(fakeUserRepository, hashProvider);
  });

  it('should be able to create a new user', async () => {
    const user = await createUser.execute({
      first_name: 'John',
      last_name: 'Doe',
      email: 'johndoe@email.com',
      nickname: 'johnDoe',
      password: '123',
      birth_date: new Date('1999-09-24'),
      description: "I'm John Doe",
    });

    expect(user).toHaveProperty('id');
  });

  it('should be not able to create a new user with an existing email', async () => {
    await createUser.execute({
      first_name: 'John',
      last_name: 'Doe',
      email: 'johndoe@email.com',
      nickname: 'johnDoe',
      password: '123',
      birth_date: new Date('1999-09-24'),
      description: "I'm John Doe",
    });

    await expect(
      createUser.execute({
        first_name: 'John',
        last_name: 'Doe',
        email: 'johndoe@email.com',
        nickname: 'johnDoe',
        password: '123',
        birth_date: new Date('1999-09-24'),
        description: "I'm John Doe",
      }),
    ).rejects.toBeInstanceOf(AppError);
  });
});
