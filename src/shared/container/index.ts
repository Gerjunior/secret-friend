import { container } from 'tsyringe';

import './providers';

import IUserRepository from '@modules/users/repositories/IUserRepository';
import UserRepository from '@modules/users/infra/typeorm/repositories/UserRepository';

import IGroupRepository from '@modules/groups/repositories/IGroupRepository';
import GroupRepository from '@modules/groups/infra/typeorm/repositories/GroupRepository';

import IGroupMembersRepository from '@modules/groups/repositories/IGroupMembersRepository';
import GroupMembersRepository from '@modules/groups/infra/typeorm/repositories/GroupMemberRepository';

import IGroupSecretFriendRepository from '@modules/groups/repositories/IGroupSecretFriendRepository';
import GroupSecretFriendRepository from '@modules/groups/infra/typeorm/repositories/GroupSecretFriendRepository';

container.registerSingleton<IUserRepository>('UserRepository', UserRepository);

container.registerSingleton<IGroupRepository>(
  'GroupRepository',
  GroupRepository,
);

container.registerSingleton<IGroupMembersRepository>(
  'GroupMembersRepository',
  GroupMembersRepository,
);

container.registerSingleton<IGroupSecretFriendRepository>(
  'GroupSecretFriendRepository',
  GroupSecretFriendRepository,
);
