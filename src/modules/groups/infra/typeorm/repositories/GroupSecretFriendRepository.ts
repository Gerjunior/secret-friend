import { Repository, getRepository } from 'typeorm';

import IGroupSecretFriendRepository from '@modules/groups/repositories/IGroupSecretFriendRepository';

import ICreateGroupSecretFriendDTO from '@modules/groups/dtos/ICreateGroupSecretFriendDTO';

import GroupSecretFriend from '../entities/GroupSecretFriend';

class GroupSecretFriendRepository implements IGroupSecretFriendRepository {
  private ormRepository: Repository<GroupSecretFriend>;

  constructor() {
    this.ormRepository = getRepository(GroupSecretFriend);
  }

  async insert({
    group_id,
    user_id,
    secret_friend_id,
  }: ICreateGroupSecretFriendDTO): Promise<GroupSecretFriend> {
    const secret_friend = await this.ormRepository.create({
      user_id,
      group_id,
      secret_friend_id,
    });

    await this.ormRepository.save(secret_friend);

    return secret_friend;
  }
}

export default GroupSecretFriendRepository;
