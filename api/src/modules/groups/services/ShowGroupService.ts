import { inject, injectable } from 'tsyringe';
import { classToClass } from 'class-transformer';

import AppError from '@shared/errors/AppError';

import IGroupRepository from '../repositories/IGroupRepository';

import Group from '../infra/typeorm/entities/Group';

@injectable()
export default class ShowGroupService {
  constructor(
    @inject('GroupRepository')
    private groupRepository: IGroupRepository,
  ) {}

  public async execute(group_id: string): Promise<Group> {
    const group = await this.groupRepository.findById(group_id);

    if (!group) {
      throw new AppError('Group not found.', 404);
    }

    return classToClass(group);
  }
}
