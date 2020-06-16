import AppError from '@shared/errors/AppError';

import FakeHashProvider from '@shared/container/providers/HashProvider/fakes/FakeHashProvider';
import FakeUserRepository from '../repositories/fakes/FakeUserRepository';

import CreateUserService from './CreateUserService';
import AuthenticateUserService from './AuthenticateUserService';

let fakeUserRepository: FakeUserRepository;
let fakeHashProvider: FakeHashProvider;
let createUser: CreateUserService;
let authenticateUser: AuthenticateUserService;

describe('AuthenticateUser', () => {
  beforeEach(() => {
    fakeUserRepository = new FakeUserRepository();
    fakeHashProvider = new FakeHashProvider();

    createUser = new CreateUserService(fakeUserRepository, fakeHashProvider);
    authenticateUser = new AuthenticateUserService(
      fakeUserRepository,
      fakeHashProvider,
    );
  });

  it('should be able to authenticate', async () => {
    const user = await createUser.execute({
      first_name: 'John',
      last_name: 'Doe',
      email: 'johndoe@email.com',
      password: '123',
      nickname: 'johnDoe',
      birth_date: new Date('1999-09-24'),
      description: "I'm John Doe",
    });

    const auth = await authenticateUser.execute({
      email: 'johndoe@email.com',
      password: '123',
    });

    expect(auth).toHaveProperty('token');
    expect(auth).toHaveProperty('user');
    expect(auth.user).toEqual(user);
  });

  it('should be not able to authenticate an unexistent user', async () => {
    await expect(
      authenticateUser.execute({
        email: 'johndoe@email.com',
        password: '123',
      }),
    ).rejects.toBeInstanceOf(AppError);
  });

  it('should be not able to authenticate with wrong password/email combination', async () => {
    await createUser.execute({
      first_name: 'John',
      last_name: 'Doe',
      email: 'johndoe@email.com',
      password: '123',
      nickname: 'johnDoe',
      birth_date: new Date('1999-09-24'),
      description: "I'm John Doe",
    });

    await expect(
      authenticateUser.execute({
        email: 'johndoe@email.com',
        password: '456',
      }),
    ).rejects.toBeInstanceOf(AppError);
  });
});
