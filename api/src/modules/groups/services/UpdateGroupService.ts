import { inject, injectable } from 'tsyringe';
import { classToClass } from 'class-transformer';

import IGroupRepository from '@modules/groups/repositories/IGroupRepository';

import Group from '@modules/groups/infra/typeorm/entities/Group';

import AppError from '@shared/errors/AppError';

interface IRequest {
  group_id: string;
  admin_id: string;
  name?: string;
  min_value?: number;
  max_value?: number;
  draw_date?: Date;
  reveal_date?: Date;
}

@injectable()
export default class UpdateGroupService {
  constructor(
    @inject('GroupRepository')
    private groupRepository: IGroupRepository,
  ) {}

  public async execute({
    group_id,
    admin_id,
    name,
    min_value,
    max_value,
    draw_date,
    reveal_date,
  }: IRequest): Promise<Group> {
    const group = await this.groupRepository.findById(group_id);

    if (!group) {
      throw new AppError('Group not found', 404);
    }

    if (group.admin_id !== admin_id) {
      throw new AppError(
        'Only the group admin can make changes to the it',
        400,
      );
    }

    const updatedGroup = await this.groupRepository.update({
      id: group_id,
      draw_date,
      max_value,
      min_value,
      name,
      reveal_date,
    });

    if (!updatedGroup) {
      throw new AppError('Group not found', 404);
    }

    return classToClass(updatedGroup);
  }
}
