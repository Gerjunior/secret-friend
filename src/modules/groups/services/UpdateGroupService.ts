import { inject, injectable } from 'tsyringe';

import IGroupRepository from '@modules/groups/repositories/IGroupRepository';

import Group from '@modules/groups/infra/typeorm/entities/Group';

import AppError from '@shared/errors/AppError';

interface IRequest {
  id: string;
  name?: string;
  min_value?: number;
  max_value?: number;
  draw_date?: Date;
  reveal_date?: Date;
}

injectable();
export default class UpdateGroupService {
  constructor(
    @inject('GroupRepository')
    private GroupRepository: IGroupRepository,
  ) {}

  public async execute({
    id,
    name,
    min_value,
    max_value,
    draw_date,
    reveal_date,
  }: IRequest): Promise<Group> {
    const group = await this.GroupRepository.update({
      group_id: id,
      draw_date,
      max_value,
      min_value,
      name,
      reveal_date,
    });

    if (!group) {
      throw new AppError('There is no group with this id.', 404);
    }

    return group;
  }
}
