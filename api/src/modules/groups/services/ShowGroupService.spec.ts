import 'reflect-metadata';
import { uuid } from 'uuidv4';

import AppError from '@shared/errors/AppError';

import User from '@modules/users/infra/typeorm/entities/User';

import CreateUserService from '@modules/users/services/CreateUserService';
import CreateGroupService from '@modules/groups/services/CreateGroupService';
import ShowGroupService from '@modules/groups/services/ShowGroupService';

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
let showGroup: ShowGroupService;

let admin: User;

describe('ShowGroup', () => {
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

    showGroup = new ShowGroupService(fakeGroupRepository);
  });

  it('should be able to show a group', async () => {
    const group = await createGroup.execute({
      admin_id: admin.id,
      name: 'Test group',
      min_value: 5,
      reveal_date: '2020-09-24',
    });

    const findGroup = await showGroup.execute(group.id);

    expect(findGroup).toEqual(group);
  });

  it('should not be able to show a group that does not exists', async () => {
    await expect(showGroup.execute(uuid())).rejects.toBeInstanceOf(AppError);
  });
});
