import GroupUser from '@modules/groups/infra/typeorm/entities/GroupUser';

export default interface IGroupUsersRepository {
  findByGroupId(group_id: string): Promise<GroupUser[] | undefined>;
  findByUserId(user_id: string): Promise<GroupUser[] | undefined>;
  findByUserAndGroupIds(
    group_id: string,
    user_id: string,
  ): Promise<GroupUser | undefined>;
  addMember(group_id: string, user_id: string): Promise<GroupUser | undefined>;
  removeMember(group_id: string, user_id: string): Promise<boolean>;
  removeAllMembers(group_id: string): Promise<boolean>;
}
