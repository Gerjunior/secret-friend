import 'reflect-metadata';
import { uuid } from 'uuidv4';

import AppError from '@shared/errors/AppError';

import User from '@modules/users/infra/typeorm/entities/User';
import Group from '@modules/groups/infra/typeorm/entities/Group';

import CreateUserService from '@modules/users/services/CreateUserService';
import CreateGroupService from '@modules/groups/services/CreateGroupService';
import DeleteGroupService from '@modules/groups/services/DeleteGroupService';

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
let deleteGroup: DeleteGroupService;

let admin: User;
let group: Group;

describe('DeleteGroup', () => {
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

    deleteGroup = new DeleteGroupService(
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

    group = await createGroup.execute({
      admin_id: admin.id,
      name: 'Test Group',
      draw_date: '20-06-2020',
      max_value: 100,
      min_value: 20,
      reveal_date: '30-06-2020',
    });
  });

  it('should be able to delete a group', async () => {
    const deleteResult = await deleteGroup.execute({
      admin_id: admin.id,
      group_id: group.id,
    });

    expect(deleteResult).toBe(true);
  });

  it('should not be able to delete a unexisting group', async () => {
    await expect(
      deleteGroup.execute({
        admin_id: admin.id,
        group_id: uuid(),
      }),
    ).rejects.toBeInstanceOf(AppError);
  });

  it('should not be able to delete a group with an unexisting user', async () => {
    await expect(
      deleteGroup.execute({
        admin_id: uuid(),
        group_id: group.id,
      }),
    ).rejects.toBeInstanceOf(AppError);
  });

  it('should not be able to delete a group without being admin', async () => {
    const user2 = await createUser.execute({
      first_name: 'Jane',
      last_name: 'Doe',
      email: 'janedoe@email.com',
      nickname: 'janeDoe',
      password: '123',
      birth_date: new Date('1999-09-24'),
      description: "I'm Jane Doe",
    });

    await expect(
      deleteGroup.execute({
        admin_id: user2.id,
        group_id: group.id,
      }),
    ).rejects.toBeInstanceOf(AppError);
  });
});
