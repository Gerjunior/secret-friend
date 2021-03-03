import 'reflect-metadata';
import { uuid } from 'uuidv4';

import AppError from '@shared/errors/AppError';

import Group from '@modules/groups/infra/typeorm/entities/Group';
import User from '@modules/users/infra/typeorm/entities/User';

import AddUserToGroupService from '@modules/groups/services/AddUserToGroupService';
import RemoveUserFromGroupService from '@modules/groups/services/RemoveUserFromGroupService';
import CreateUserService from '@modules/users/services/CreateUserService';
import CreateGroupService from '@modules/groups/services/CreateGroupService';
import DrawService from '@modules/groups/services/DrawService';

import FakeUserRepository from '@modules/users/repositories/fakes/FakeUserRepository';
import FakeGroupRepository from '@modules/groups/repositories/fakes/FakeGroupRepository';
import FakeHashProvider from '@shared/container/providers/HashProvider/fakes/FakeHashProvider';
import FakeGroupUserRepository from '../repositories/fakes/FakeGroupUserRepository';
import FakeSecretFriendRepository from '../repositories/fakes/FakeSecretFriendRepository';

let fakeUserRepository: FakeUserRepository;
let fakeHashProvider: FakeHashProvider;
let fakeGroupRepository: FakeGroupRepository;
let fakeGroupUserRepository: FakeGroupUserRepository;
let fakeSecretFriendRepository: FakeSecretFriendRepository;

let createGroup: CreateGroupService;
let createUser: CreateUserService;
let addUserToGroup: AddUserToGroupService;
let removeUserFromGroup: RemoveUserFromGroupService;
let draw: DrawService;

let admin: User;
let group: Group;
let member: User;
let member2: User;

describe('Draw', () => {
  beforeEach(async () => {
    fakeUserRepository = new FakeUserRepository();
    fakeGroupRepository = new FakeGroupRepository();
    fakeGroupUserRepository = new FakeGroupUserRepository();
    fakeHashProvider = new FakeHashProvider();
    fakeSecretFriendRepository = new FakeSecretFriendRepository();

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

    removeUserFromGroup = new RemoveUserFromGroupService(
      fakeUserRepository,
      fakeGroupRepository,
      fakeGroupUserRepository,
    );

    draw = new DrawService(
      fakeGroupRepository,
      fakeGroupUserRepository,
      fakeSecretFriendRepository,
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

    member2 = await createUser.execute({
      first_name: 'Jooooooohn',
      last_name: 'Ceeeenaa',
      email: 'johncenaaaa@email.com',
      nickname: 'CENAAAA',
      password: '123',
      birth_date: new Date('1999-09-24'),
      description: "I'm JOOOHN CEEENAA",
    });

    await addUserToGroup.execute({
      group_id: group.id,
      admin_id: admin.id,
      user_id: member.id,
    });

    await addUserToGroup.execute({
      group_id: group.id,
      admin_id: admin.id,
      user_id: member2.id,
    });
  });

  it('should be able to realize the draw', async () => {
    const groupAfterDraw = await draw.execute({
      group_id: group.id,
      admin_id: admin.id,
    });

    expect(groupAfterDraw.status_flag).toBe('D');
  });

  it('should not be able to realize the draw of an unexisting group', async () => {
    await expect(
      draw.execute({
        group_id: uuid(),
        admin_id: admin.id,
      }),
    ).rejects.toBeInstanceOf(AppError);
  });

  it('should not be able to realize the draw without admin rights', async () => {
    await expect(
      draw.execute({
        group_id: group.id,
        admin_id: member.id,
      }),
    ).rejects.toBeInstanceOf(AppError);
  });

  it('should not be able to realize the draw if the status_flag IS NOT "A" (Awaiting)', async () => {
    await draw.execute({
      group_id: group.id,
      admin_id: admin.id,
    });

    await expect(
      draw.execute({
        group_id: group.id,
        admin_id: admin.id,
      }),
    ).rejects.toBeInstanceOf(AppError);
  });

  it('should not be able to realize the draw if the group has lesser than 3 members', async () => {
    await removeUserFromGroup.execute({
      group_id: group.id,
      admin_id: admin.id,
      user_id: member2.id,
    });

    await expect(
      draw.execute({
        group_id: group.id,
        admin_id: admin.id,
      }),
    ).rejects.toBeInstanceOf(AppError);
  });
});
