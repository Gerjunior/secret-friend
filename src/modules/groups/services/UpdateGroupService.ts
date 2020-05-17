import cleanDeep from 'clean-deep';

import groupSchema, {
  IGroupMembers,
} from '@modules/groups/infra/mongoose/schemas/Groups';

import AppError from '@shared/errors/AppError';

interface IRequest {
  id: string;
  name: string;
  min_value: number;
  max_value: number;
  draw_date: Date;
  reveal_date: Date;
}

interface IResponse {
  id: string;
  name: string;
  min_value: number;
  max_value: number;
  draw_date: Date;
  reveal_date: Date;
  admin_nickname: string;
  members: [IGroupMembers];
}

export default class UpdateGroupService {
  public async execute({
    id,
    name,
    min_value,
    max_value,
    draw_date,
    reveal_date,
  }: IRequest): Promise<IResponse> {
    const group = await groupSchema.findByIdAndUpdate(
      id,
      cleanDeep({
        name,
        min_value,
        max_value,
        draw_date,
        reveal_date,
      }),
      { new: true },
    );

    if (!group) {
      throw new AppError('There is no group with this id.', 404);
    }

    return {
      id,
      name: group.name,
      min_value: group.min_value,
      max_value: group.max_value,
      draw_date: group.draw_date,
      reveal_date: group.reveal_date,
      admin_nickname: group.admin_nickname,
      members: group.members,
    };
  }
}
