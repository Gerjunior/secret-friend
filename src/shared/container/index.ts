import { container } from 'tsyringe';

import './providers';

import IUsersRepository from '@modules/users/repositories/IUsersRepository';
import UsersRepository from '@modules/users/infra/mongoose/repositories/UsersRepository';

import IUserFriendsRepository from '@modules/users/repositories/IUserFriendsRepository';
import UserFriendsRepository from '@modules/users/infra/mongoose/repositories/UserFriendsRepository';

import IGroupsRepository from '@modules/groups/repositories/IGroupsRepository';
import GroupsRepository from '@modules/groups/infra/mongoose/repositories/GroupsRepository';

import IGroupMembersRepository from '@modules/groups/repositories/IGroupMembersRepository';
import GroupMembersRepository from '@modules/groups/infra/mongoose/repositories/GroupMembersRepository';

container.registerSingleton<IUsersRepository>(
  'UsersRepository',
  UsersRepository,
);

container.registerSingleton<IUserFriendsRepository>(
  'UserFriendsRepository',
  UserFriendsRepository,
);

container.registerSingleton<IGroupsRepository>(
  'GroupsRepository',
  GroupsRepository,
);

container.registerSingleton<IGroupMembersRepository>(
  'GroupMembersRepository',
  GroupMembersRepository,
);
