import { Repository, getRepository } from 'typeorm';

import IUpdateSecretFriendDTO from '@modules/groups/dtos/IUpdateSecretFriendDTO';

import ISecretFriendRepository from '@modules/groups/repositories/ISecretFriendRepository';

import GroupUser from '../entities/GroupUser';

class SecretFriendRepository implements ISecretFriendRepository {
  private ormRepository: Repository<GroupUser>;

  constructor() {
    this.ormRepository = getRepository(GroupUser);
  }

  async updateSecretFriend({
    group_id,
    user_id,
    secret_friend_id,
  }: IUpdateSecretFriendDTO): Promise<GroupUser> {
    const groupUser = await this.ormRepository.save({
      group_id,
      user_id,
      secret_friend_id,
    });

    return groupUser;
  }
}

export default SecretFriendRepository;
