import { inject, injectable } from 'tsyringe';
import cleanDeep from 'clean-deep';

import IGroupsRepository from '@modules/groups/repositories/IGroupsRepository';

import IGroupMembers from '@modules/groups/entities/IGroupMembers';

import AppError from '@shared/errors/AppError';

interface IRequest {
  id: string;
  name?: string;
  min_value?: number;
  max_value?: number;
  draw_date?: Date;
  reveal_date?: Date;
}

interface IResponse {
  id?: string;
  name?: string;
  min_value?: number;
  max_value?: number;
  draw_date?: Date;
  reveal_date?: Date;
  admin_nickname?: string;
  members?: [IGroupMembers];
}

injectable();
export default class UpdateGroupService {
  constructor(
    @inject('GroupsRepository')
    private groupsRepository: IGroupsRepository,
  ) {}

  public async execute({
    id,
    name,
    min_value,
    max_value,
    draw_date,
    reveal_date,
  }: IRequest): Promise<IResponse> {
    const group = await this.groupsRepository.update({
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

    return cleanDeep(group);
  }
}
