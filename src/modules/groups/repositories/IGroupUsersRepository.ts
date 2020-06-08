import GroupUser from '@modules/groups/infra/typeorm/entities/GroupUser';

import IUpdateSecretFriendDTO from '@modules/groups/dtos/IUpdateSecretFriendDTO';

export default interface IGroupUsersRepository {
  findByGroupId(group_id: string): Promise<GroupUser[] | undefined>;
  findByUserId(user_id: string): Promise<GroupUser[] | undefined>;
  findByUserAndGroupIds(
    group_id: string,
    user_id: string,
  ): Promise<GroupUser | undefined>;
  addMember(group_id: string, user_id: string): Promise<GroupUser | undefined>;
  removeMember(group_id: string, user_id: string): Promise<boolean>;
  updateSecretFriend({
    group_id,
    user_id,
    secret_friend_id,
  }: IUpdateSecretFriendDTO): Promise<GroupUser>;
}
