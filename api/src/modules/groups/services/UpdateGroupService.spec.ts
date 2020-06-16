import 'reflect-metadata';
import { uuid } from 'uuidv4';

import AppError from '@shared/errors/AppError';

import User from '@modules/users/infra/typeorm/entities/User';
import Group from '@modules/groups/infra/typeorm/entities/Group';

import CreateUserService from '@modules/users/services/CreateUserService';
import CreateGroupService from '@modules/groups/services/CreateGroupService';
import UpdateGroupService from '@modules/groups/services/UpdateGroupService';

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
let updateGroup: UpdateGroupService;

let admin: User;
let group: Group;

describe('UpdateGroup', () => {
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

    updateGroup = new UpdateGroupService(fakeGroupRepository);

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
      draw_date: '2020-06-01',
      max_value: 100,
      min_value: 20,
      reveal_date: '2020-06-06',
    });
  });

  it('should be able to update a group', async () => {
    Object.assign(group, {
      name: 'ALTERED',
      max_value: 200,
      min_value: 100,
    });

    const updatedGroup = await updateGroup.execute({
      ...group,
      group_id: group.id,
    });

    expect(updatedGroup).toEqual(group);
  });

  it('should not be able to update a group that does not exists', async () => {
    await expect(
      updateGroup.execute({
        ...group,
        group_id: uuid(),
      }),
    ).rejects.toBeInstanceOf(AppError);
  });

  it('should be able to update a group', async () => {
    Object.assign(group, {
      name: 'ALTERED',
      max_value: 200,
      min_value: 100,
    });

    const updatedGroup = await updateGroup.execute({
      ...group,
      group_id: group.id,
    });

    expect(updatedGroup).toEqual(group);
  });

  it('should not be able to update a group if user is not admin', async () => {
    const jane = await createUser.execute({
      first_name: 'Jane',
      last_name: 'Doe',
      email: 'janedoe@email.com',
      nickname: 'janeDoe',
      password: '123',
      birth_date: new Date('1999-09-24'),
      description: "I'm Jane Doe",
    });

    Object.assign(group, {
      admin_id: jane.id,
      name: 'ALTERED',
      max_value: 200,
      min_value: 100,
    });

    await expect(
      updateGroup.execute({
        ...group,
        group_id: group.id,
      }),
    ).rejects.toBeInstanceOf(AppError);
  });
});
