import IUpdateSecretFriendDTO from '@modules/groups/dtos/IUpdateSecretFriendDTO';

import ISecretFriendRepository from '@modules/groups/repositories/ISecretFriendRepository';

import GroupUser from '@modules/groups/infra/typeorm/entities/GroupUser';
import FakeGroupUserRepository from './FakeGroupUserRepository';

class FakeSecretFriendRepository extends FakeGroupUserRepository
  implements ISecretFriendRepository {
  async updateSecretFriend({
    group_id,
    user_id,
    secret_friend_id,
  }: IUpdateSecretFriendDTO): Promise<GroupUser> {
    const groupUserIndex = this.groupUsers.findIndex(
      groupUser =>
        groupUser.group_id === group_id && groupUser.user_id === user_id,
    );

    this.groupUsers[groupUserIndex].secret_friend_id = secret_friend_id;

    return this.groupUsers[groupUserIndex];
  }
}

export default FakeSecretFriendRepository;
