import AppError from '@shared/errors/AppError';

import FakeHashProvider from '@shared/container/providers/HashProvider/fakes/FakeHashProvider';
import { uuid } from 'uuidv4';
import FakeUserRepository from '../repositories/fakes/FakeUserRepository';

import CreateUserService from './CreateUserService';
import UpdateUserService from './UpdateUserService';

let fakeUserRepository: FakeUserRepository;
let hashProvider: FakeHashProvider;
let createUser: CreateUserService;
let updateUser: UpdateUserService;

describe('UpdateUser', () => {
  beforeEach(() => {
    fakeUserRepository = new FakeUserRepository();
    hashProvider = new FakeHashProvider();

    createUser = new CreateUserService(fakeUserRepository, hashProvider);
    updateUser = new UpdateUserService(fakeUserRepository, hashProvider);
  });

  it('should be able to update an user', async () => {
    const user = await createUser.execute({
      first_name: 'John',
      last_name: 'Doe',
      email: 'johndoe@email.com',
      nickname: 'johnDoe',
      password: '123',
      birth_date: new Date('1999-09-24'),
      description: "I'm John Doe",
    });

    const description = 'I changed my description for testing purposes!';
    const first_name = 'I changed my first_name for testing purposes!';
    const last_name = 'I changed my first_name for testing purposes!';
    const birth_date = new Date();
    const nickname = 'New nickname!';

    Object.assign(user, {
      description,
      first_name,
      last_name,
      birth_date,
      nickname,
    });

    const updatedUser = await updateUser.execute(user);

    expect(updatedUser.description).toEqual(description);
    expect(updatedUser.first_name).toEqual(first_name);
    expect(updatedUser.last_name).toEqual(last_name);
    expect(updatedUser.birth_date).toEqual(birth_date);
    expect(updatedUser.nickname).toEqual(nickname);
  });

  it('should not be able to update an unexisting user', async () => {
    await expect(updateUser.execute({ id: uuid() })).rejects.toBeInstanceOf(
      AppError,
    );
  });

  it('should not be able to update an user email', async () => {
    const user = await createUser.execute({
      first_name: 'John',
      last_name: 'Doe',
      email: 'johndoe@email.com',
      nickname: 'johnDoe',
      password: '123',
      birth_date: new Date('1999-09-24'),
      description: "I'm John Doe",
    });

    Object.assign(user, { email: 'updated@email.com' });

    const updatedUser = await updateUser.execute(user);

    expect(updatedUser.email).toEqual('johndoe@email.com');
  });

  it('should not be able to update password directly', async () => {
    const user = await createUser.execute({
      first_name: 'John',
      last_name: 'Doe',
      email: 'johndoe@email.com',
      nickname: 'johnDoe',
      password: '123',
      birth_date: new Date('1999-09-24'),
      description: "I'm John Doe",
    });

    Object.assign(user, { password: '654654' });

    const updatedUser = await updateUser.execute(user);

    expect(updatedUser.password).toEqual('123');
  });

  it('should not be able to update user password if old_password is wrong', async () => {
    const user = await createUser.execute({
      first_name: 'John',
      last_name: 'Doe',
      email: 'johndoe@email.com',
      nickname: 'johnDoe',
      password: '123',
      birth_date: new Date('1999-09-24'),
      description: "I'm John Doe",
    });

    await expect(
      updateUser.execute({
        id: user.id,
        old_password: '456',
        password: '789',
        password_confirmation: '789',
      }),
    ).rejects.toBeInstanceOf(AppError);
  });

  it('should not be able to update user password if password is different from password_confirmation', async () => {
    const user = await createUser.execute({
      first_name: 'John',
      last_name: 'Doe',
      email: 'johndoe@email.com',
      nickname: 'johnDoe',
      password: '123',
      birth_date: new Date('1999-09-24'),
      description: "I'm John Doe",
    });

    await expect(
      updateUser.execute({
        id: user.id,
        old_password: '123',
        password: '789',
        password_confirmation: '101112',
      }),
    ).rejects.toBeInstanceOf(AppError);
  });

  it('should be able to update user password', async () => {
    const user = await createUser.execute({
      first_name: 'John',
      last_name: 'Doe',
      email: 'johndoe@email.com',
      nickname: 'johnDoe',
      password: '123',
      birth_date: new Date('1999-09-24'),
      description: "I'm John Doe",
    });

    const updatedUser = await updateUser.execute({
      id: user.id,
      old_password: '123',
      password: '789',
      password_confirmation: '789',
    });

    expect(updatedUser.password).toBe('789');
  });
});
