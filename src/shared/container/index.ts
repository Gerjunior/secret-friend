import { container } from 'tsyringe';

import './providers';

import IUsersRepository from '@modules/users/repositories/IUsersRepository';
import UsersRepository from '@modules/users/infra/mongoose/repositories/UsersRepository';

import IUserGroupsRepository from '@modules/users/repositories/IUserGroupsRepository';
import UserGroupsRepository from '@modules/users/infra/mongoose/repositories/UserGroupsRepository';

import IUserFriendsRepository from '@modules/users/repositories/IUserFriendsRepository';
import UserFriendsRepository from '@modules/users/infra/mongoose/repositories/UserFriendsRepository';

container.registerSingleton<IUsersRepository>(
  'UsersRepository',
  UsersRepository,
);

container.registerSingleton<IUserGroupsRepository>(
  'UserGroupsRepository',
  UserGroupsRepository,
);

container.registerSingleton<IUserFriendsRepository>(
  'UserFriendsRepository',
  UserFriendsRepository,
);
