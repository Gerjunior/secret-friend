import 'reflect-metadata';
import { uuid } from 'uuidv4';

import AppError from '@shared/errors/AppError';

import User from '@modules/users/infra/typeorm/entities/User';
import Group from '@modules/groups/infra/typeorm/entities/Group';

import CreateUserService from '@modules/users/services/CreateUserService';
import CreateGroupService from '@modules/groups/services/CreateGroupService';
import AddUserToGroupService from '@modules/groups/services/AddUserToGroupService';

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
let addUserToGroup: AddUserToGroupService;

let admin: User;
let group: Group;
let member: User;

describe('AddUserToGroup', () => {
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

    addUserToGroup = new AddUserToGroupService(
      fakeUserRepository,
      fakeGroupRepository,
      fakeGroupUserRepository,
    );

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

    member = await createUser.execute({
      first_name: 'Jane',
      last_name: 'Doe',
      email: 'janedoe@email.com',
      nickname: 'janeDoe',
      password: '123',
      birth_date: new Date('1999-09-24'),
      description: "I'm Jane Doe",
    });
  });

  it('should be able to add a user to the group', async () => {
    await addUserToGroup.execute({
      group_id: group.id,
      admin_id: admin.id,
      user_id: member.id,
    });

    const groupUser = await fakeGroupUserRepository.findByUserAndGroupIds(
      group.id,
      member.id,
    );

    expect(groupUser).toHaveProperty('group_id');
    expect(groupUser).toHaveProperty('user_id');
    expect(groupUser).toHaveProperty('member_since');
  });

  it('should not be able to add a user to an unexisting group', async () => {
    await expect(
      addUserToGroup.execute({
        group_id: uuid(),
        admin_id: admin.id,
        user_id: member.id,
      }),
    ).rejects.toBeInstanceOf(AppError);
  });

  it('should no be able to add a user to the group with an unexisting admin_id', async () => {
    await expect(
      addUserToGroup.execute({
        group_id: group.id,
        admin_id: uuid(),
        user_id: member.id,
      }),
    ).rejects.toBeInstanceOf(AppError);
  });

  it('should not be able to add an unexisting user to the group', async () => {
    await expect(
      addUserToGroup.execute({
        group_id: group.id,
        admin_id: admin.id,
        user_id: uuid(),
      }),
    ).rejects.toBeInstanceOf(AppError);
  });

  it('should not be able to add an user that is already in the group', async () => {
    await expect(
      addUserToGroup.execute({
        group_id: group.id,
        admin_id: admin.id,
        user_id: admin.id,
      }),
    ).rejects.toBeInstanceOf(AppError);
  });

  it('should not be able to add an user to the group without administration rights', async () => {
    await expect(
      addUserToGroup.execute({
        group_id: group.id,
        admin_id: member.id,
        user_id: admin.id,
      }),
    ).rejects.toBeInstanceOf(AppError);
  });

  it('should not be able to add an user to the group if the status is not "A" (Awaiting)', async () => {
    await fakeGroupRepository.update({ id: group.id, status_flag: 'D' });

    await expect(
      addUserToGroup.execute({
        group_id: group.id,
        admin_id: admin.id,
        user_id: member.id,
      }),
    ).rejects.toBeInstanceOf(AppError);
  });
});
