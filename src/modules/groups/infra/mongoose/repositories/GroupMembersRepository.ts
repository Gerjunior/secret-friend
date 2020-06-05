import IGroupMembersRepository from '@modules/groups/repositories/IGroupMembersRepository';
import IAddMemberToGroupDTO from '@modules/groups/dtos/IAddMemberToGroupDTO';

import GroupSchema from '@modules/groups/infra/mongoose/schemas/Groups';
import UsersSchema from '@modules/users/infra/mongoose/schemas/Users';

import IGroup from '@modules/groups/entities/IGroup';

export default class GroupMembersRepository implements IGroupMembersRepository {
  public async addMember({
    group_id,
    user_id,
    name,
    last_name,
    nickname,
    description,
    email,
    birth_date,
  }: IAddMemberToGroupDTO): Promise<IGroup | undefined> {
    const updatedGroup = await GroupSchema.findByIdAndUpdate(
      group_id,
      {
        $push: {
          members: {
            _id: user_id,
            name,
            nickname,
            email,
            birth_date,
            description,
          },
        },
      },
      { new: true },
    );

    if (!updatedGroup) {
      return undefined;
    }

    const {
      status,
      admin_nickname,
      created_at,
      members,
      updated_at,
      draw_date,
      max_value,
      min_value,
      reveal_date,
    } = updatedGroup;

    await UsersSchema.findOneAndUpdate(
      { _id: user_id },
      { $push: { groups: { id: group_id, name, status } } },
    );

    return {
      _id: group_id,
      status,
      name,
      admin_nickname,
      created_at,
      members,
      updated_at,
      draw_date,
      max_value,
      min_value,
      reveal_date,
    };
  }

  public async removeMember(
    group_id: string,
    user_id: string,
  ): Promise<IGroup | undefined> {
    const updatedGroup = await GroupSchema.findByIdAndUpdate(
      group_id,
      {
        $pull: {
          members: {
            _id: user_id,
          },
        },
      },
      { new: true },
    );

    if (!updatedGroup) {
      return undefined;
    }

    await UsersSchema.findOneAndUpdate(
      { _id: user_id },
      { $pull: { groups: { id: group_id } } },
    );

    return updatedGroup;
  }
}
