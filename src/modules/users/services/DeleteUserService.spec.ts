import { uuid } from 'uuidv4';

import AppError from '@shared/errors/AppError';

import FakeHashProvider from '@shared/container/providers/HashProvider/fakes/FakeHashProvider';
import FakeUserRepository from '../repositories/fakes/FakeUserRepository';

import CreateUserService from './CreateUserService';
import DeleteUserService from './DeleteUserService';

let fakeUserRepository: FakeUserRepository;
let fakeHashProvider: FakeHashProvider;
let createUser: CreateUserService;
let deleteUser: DeleteUserService;

describe('DeleteUser', () => {
  beforeEach(() => {
    fakeUserRepository = new FakeUserRepository();
    fakeHashProvider = new FakeHashProvider();

    createUser = new CreateUserService(fakeUserRepository, fakeHashProvider);
    deleteUser = new DeleteUserService(fakeUserRepository);
  });

  it('should be able to delete a user', async () => {
    const user = await createUser.execute({
      first_name: 'John',
      last_name: 'Doe',
      email: 'johndoe@email.com',
      password: '123',
      nickname: 'johnDoe',
      birth_date: new Date('1999-09-24'),
      description: "I'm John Doe",
    });

    const deleteResult = await deleteUser.execute(user.id);

    await expect(deleteResult).toBe(true);
  });

  it('should not be able to delete an unexisting user', async () => {
    await expect(deleteUser.execute(uuid())).rejects.toBeInstanceOf(AppError);
  });
});
