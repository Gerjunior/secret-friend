import IGroupUsersRepository from '@modules/groups/repositories/IGroupUsersRepository';

import GroupUser from '@modules/groups/infra/typeorm/entities/GroupUser';

class FakeGroupUserRepository implements IGroupUsersRepository {
  protected groupUsers: GroupUser[] = [];

  async findByGroupId(group_id: string): Promise<GroupUser[] | undefined> {
    return this.groupUsers.filter(groupUser => groupUser.group_id === group_id);
  }

  async findByUserId(user_id: string): Promise<GroupUser[] | undefined> {
    return this.groupUsers.filter(groupUser => groupUser.user_id === user_id);
  }

  async findByUserAndGroupIds(
    group_id: string,
    user_id: string,
  ): Promise<GroupUser | undefined> {
    return this.groupUsers.find(
      groupUser =>
        groupUser.group_id === group_id && groupUser.user_id === user_id,
    );
  }

  async addMember(
    group_id: string,
    user_id: string,
  ): Promise<GroupUser | undefined> {
    const groupUser = new GroupUser();

    Object.assign(groupUser, { group_id, user_id, member_since: new Date() });

    this.groupUsers.push(groupUser);

    return groupUser;
  }

  async removeMember(group_id: string, user_id: string): Promise<boolean> {
    const groupUserIndex = this.groupUsers.findIndex(
      groupUser =>
        groupUser.group_id === group_id && groupUser.user_id === user_id,
    );

    if (groupUserIndex === -1) {
      return false;
    }

    this.groupUsers.splice(groupUserIndex, 1);

    return true;
  }

  async removeAllMembers(group_id: string): Promise<boolean> {
    const updatedList = this.groupUsers.filter(
      groupUser => groupUser.group_id !== group_id,
    );

    if (updatedList.length === this.groupUsers.length) {
      return false;
    }

    this.groupUsers = updatedList;

    return true;
  }
}

export default FakeGroupUserRepository;
