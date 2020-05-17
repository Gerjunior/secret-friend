import { IGroup } from '@modules/groups/infra/mongoose/schemas/Groups';
import userSchema, { IUser } from '@modules/users/infra/mongoose/schemas/Users';
import IUserGroupsRepository from '@modules/users/repositories/IUserGroupsRepository';

class UserGroups implements IUserGroupsRepository {
  public async addGroupToUser(
    group: IGroup,
    nickname: string,
  ): Promise<IUser | undefined> {
    const user = await userSchema.findOneAndUpdate(
      { nickname },
      { $push: { groups: group } },
    );

    return user || undefined;
  }
}

export default UserGroups;
