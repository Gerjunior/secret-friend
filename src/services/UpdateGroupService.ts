import groupSchema, { IGroup } from '../models/Groups';

import AppError from '../errors/AppError';

interface IRequest {
  id: string;
  name: string;
  min_value: number;
  max_value: number;
  draw_date: Date;
  reveal_date: Date;
}

class UpdateGroupService {
  public async execute({
    id,
    name,
    min_value,
    max_value,
    draw_date,
    reveal_date,
  }: IRequest): Promise<IGroup> {
    const group = await groupSchema.findById(id);

    if (!group) {
      throw new AppError('There is no group with this id.', 404);
    }

    await groupSchema.findByIdAndUpdate(id, {
      name,
      min_value,
      max_value,
      draw_date,
      reveal_date,
    });

    return group;
  }
}

export default UpdateGroupService;
