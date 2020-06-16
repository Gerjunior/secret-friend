import { injectable, inject } from 'tsyringe';
import { isBefore, parseISO } from 'date-fns';
import { classToClass } from 'class-transformer';

import Group from '@modules/groups/infra/typeorm/entities/Group';

import AppError from '@shared/errors/AppError';
import GroupStatus from '@modules/groups/entities/enums/GroupStatus';

import IUserRepository from '@modules/users/repositories/IUserRepository';

import IGroupRepository from '../repositories/IGroupRepository';
import IGroupUsersRepository from '../repositories/IGroupUsersRepository';

interface IRequest {
  admin_id: string;
  name: string;
  min_value?: number;
  max_value?: number;
  draw_date?: string;
  reveal_date?: string;
}

@injectable()
export default class CreateGroupService {
  constructor(
    @inject('UserRepository')
    private userRepository: IUserRepository,

    @inject('GroupRepository')
    private groupRepository: IGroupRepository,

    @inject('GroupUsersRepository')
    private groupUsersRepository: IGroupUsersRepository,
  ) {}

  public async execute({
    admin_id,
    name,
    draw_date,
    reveal_date,
    max_value,
    min_value,
  }: IRequest): Promise<Group> {
    const admin = await this.userRepository.findById(admin_id);

    if (!admin) {
      throw new AppError('User not found.', 404);
    }

    if (min_value && max_value && min_value > max_value) {
      throw new AppError(
        'The minimum value cannot be greater than the maximum value',
        400,
      );
    }

    const parsed_reveal_date = reveal_date ? parseISO(reveal_date) : undefined;
    const parsed_draw_date = draw_date ? parseISO(draw_date) : undefined;

    if (
      parsed_reveal_date &&
      parsed_draw_date &&
      isBefore(parsed_reveal_date, parsed_draw_date)
    ) {
      throw new AppError(
        'The reveal date cannot happen before the draw date.',
        400,
      );
    }

    const group = (await this.groupRepository.create({
      name,
      max_value,
      min_value,
      reveal_date: parsed_reveal_date,
      draw_date: parsed_draw_date,
      admin_id: admin.id,
      status_flag: GroupStatus.Awaiting,
    })) as Group;

    await this.groupUsersRepository.addMember(group.id, admin.id);

    return classToClass(group);
  }
}
