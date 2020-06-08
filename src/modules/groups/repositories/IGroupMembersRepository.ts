import GroupMember from '@modules/groups/infra/typeorm/entities/GroupMember';

export default interface IGroupMembersRepository {
  findByGroupId(group_id: string): Promise<GroupMember[] | undefined>;
  findByUserId(user_id: string): Promise<GroupMember[] | undefined>;
  findByUserAndGroupIds(
    group_id: string,
    user_id: string,
  ): Promise<GroupMember | undefined>;
  addMember(
    group_id: string,
    user_id: string,
  ): Promise<GroupMember | undefined>;
  removeMember(group_id: string, user_id: string): Promise<boolean>;
}
