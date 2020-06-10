import { container } from 'tsyringe';

import './providers';

import IUserRepository from '@modules/users/repositories/IUserRepository';
import UserRepository from '@modules/users/infra/typeorm/repositories/UserRepository';

import IGroupRepository from '@modules/groups/repositories/IGroupRepository';
import GroupRepository from '@modules/groups/infra/typeorm/repositories/GroupRepository';

import IGroupUsersRepository from '@modules/groups/repositories/IGroupUsersRepository';
import GroupUsersRepository from '@modules/groups/infra/typeorm/repositories/GroupUserRepository';

import ISecretFriendRepository from '@modules/groups/repositories/ISecretFriendRepository';
import SecretFriendRepository from '@modules/groups/infra/typeorm/repositories/SecretFriendRepository';

container.registerSingleton<IUserRepository>('UserRepository', UserRepository);

container.registerSingleton<IGroupRepository>(
  'GroupRepository',
  GroupRepository,
);

container.registerSingleton<IGroupUsersRepository>(
  'GroupUsersRepository',
  GroupUsersRepository,
);

container.registerSingleton<ISecretFriendRepository>(
  'SecretFriendRepository',
  SecretFriendRepository,
);
