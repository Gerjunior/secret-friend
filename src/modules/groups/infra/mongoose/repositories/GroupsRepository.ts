import cleanDeep from 'clean-deep';

import IGroup from '@modules/groups/entities/IGroup';
import IUser from '@modules/users/entities/IUser';

import IGroupRepository from '@modules/groups/repositories/IGroupsRepository';
import ICreateGroupDTO from '@modules/groups/dtos/ICreateGroupDTO';
import IUpdateGroupDTO from '@modules/groups/dtos/IUpdateGroupDTO';

import GroupSchema from '@modules/groups/infra/mongoose/schemas/Groups';
import UserSchema from '@modules/users/infra/mongoose/schemas/Users';

export default class GroupRepository implements IGroupRepository {
  public async create(
    {
      name,
      max_value,
      min_value,
      reveal_date,
      draw_date,
      admin_nickname,
    }: ICreateGroupDTO,
    admin: IUser,
  ): Promise<IGroup | undefined> {
    const group = await GroupSchema.create({
      name,
      max_value,
      min_value,
      reveal_date,
      draw_date,
      admin_nickname,
      members: [admin],
    });

    if (!group) {
      return undefined;
    }

    await UserSchema.findOneAndUpdate(
      { nickname: admin_nickname },
      {
        $push: {
          groups: {
            id: group._id,
            name: group.name,
            status: group.status,
          },
        },
      },
    );

    return group;
  }

  public async findById(group_id: string): Promise<IGroup | undefined> {
    const group = await GroupSchema.findById(group_id);

    return group || undefined;
  }

  public async update({
    group_id,
    name,
    min_value,
    max_value,
    reveal_date,
    draw_date,
    status,
    members,
  }: IUpdateGroupDTO): Promise<IGroup | undefined> {
    const group = await GroupSchema.findByIdAndUpdate(
      group_id,
      cleanDeep({
        name,
        min_value,
        max_value,
        draw_date,
        reveal_date,
        status,
        members,
      }),
      { new: true },
    );

    return group || undefined;
  }
}
