import GroupSecretFriend from '@modules/groups/infra/typeorm/entities/GroupSecretFriend';

import ICreateGroupSecretFriend from '@modules/groups/dtos/ICreateGroupSecretFriendDTO';

export default interface IGroupSecretFriendRepository {
  insert(data: ICreateGroupSecretFriend): Promise<GroupSecretFriend>;
}
