import 'reflect-metadata';
import { uuid } from 'uuidv4';

import AppError from '@shared/errors/AppError';

import User from '@modules/users/infra/typeorm/entities/User';

import CreateUserService from '@modules/users/services/CreateUserService';
import CreateGroupService from '@modules/groups/services/CreateGroupService';

import FakeUserRepository from '@modules/users/repositories/fakes/FakeUserRepository';
import FakeGroupRepository from '@modules/groups/repositories/fakes/FakeGroupRepository';
import FakeHashProvider from '@shared/container/providers/HashProvider/fakes/FakeHashProvider';

import FakeGroupUserRepository from '../repositories/fakes/FakeGroupUserRepository';

let fakeUserRepository: FakeUserRepository;
let fakeHashProvider: FakeHashProvider;
let fakeGroupRepository: FakeGroupRepository;
let fakeGroupUserRepository: FakeGroupUserRepository;

let createGroup: CreateGroupService;
let createUser: CreateUserService;

let admin: User;

describe('CreateGroup', () => {
  beforeEach(async () => {
    fakeUserRepository = new FakeUserRepository();
    fakeGroupRepository = new FakeGroupRepository();
    fakeGroupUserRepository = new FakeGroupUserRepository();
    fakeHashProvider = new FakeHashProvider();

    createGroup = new CreateGroupService(
      fakeUserRepository,
      fakeGroupRepository,
      fakeGroupUserRepository,
    );

    createUser = new CreateUserService(fakeUserRepository, fakeHashProvider);

    admin = await createUser.execute({
      first_name: 'John',
      last_name: 'Doe',
      email: 'johndoe@email.com',
      nickname: 'johnDoe',
      password: '123',
      birth_date: new Date('1999-09-24'),
      description: "I'm John Doe",
    });
  });

  it('should be able to create a new group', async () => {
    const group = await createGroup.execute({
      admin_id: admin.id,
      name: 'Test group',
      min_value: 5,
      reveal_date: '2020-09-24',
    });

    const group2 = await createGroup.execute({
      admin_id: admin.id,
      name: 'Test group',
      max_value: 50,
      draw_date: '2020-09-24',
    });

    expect(group).toHaveProperty('id');
    expect(group2).toHaveProperty('id');
  });

  it('should not be able to create a new group with an unexisting admin', async () => {
    await expect(
      createGroup.execute({
        admin_id: uuid(),
        name: 'Test group',
      }),
    ).rejects.toBeInstanceOf(AppError);
  });

  it('should not be able to create a group with min_value being higher (>) than max_value', async () => {
    await expect(
      createGroup.execute({
        admin_id: admin.id,
        name: 'Test group',
        min_value: 15,
        max_value: 10,
      }),
    ).rejects.toBeInstanceOf(AppError);
  });

  it('should not be able to create a group with reveal_date being after draw_date', async () => {
    await expect(
      createGroup.execute({
        admin_id: admin.id,
        name: 'Test group',
        reveal_date: '2020-09-23',
        draw_date: '2020-09-24',
      }),
    ).rejects.toBeInstanceOf(AppError);
  });
});
