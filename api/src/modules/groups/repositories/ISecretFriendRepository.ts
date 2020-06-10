import IUpdateSecretFriendDTO from '../dtos/IUpdateSecretFriendDTO';
import GroupUser from '../infra/typeorm/entities/GroupUser';

export default interface ISecretFriendRepository {
  updateSecretFriend({
    group_id,
    user_id,
    secret_friend_id,
  }: IUpdateSecretFriendDTO): Promise<GroupUser>;
}
