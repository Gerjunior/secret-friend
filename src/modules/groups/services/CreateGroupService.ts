import { isBefore, parseISO } from 'date-fns';
import { injectable, inject } from 'tsyringe';

import Group from '@modules/groups/infra/typeorm/entities/Group';

import AppError from '@shared/errors/AppError';
import GroupStatus from '@modules/groups/entities/enums/GroupStatus';

import IUserRepository from '@modules/users/repositories/IUserRepository';

import IGroupRepository from '../repositories/IGroupRepository';
import IGroupUsersRepository from '../repositories/IGroupUsersRepository';

interface IRequest {
  admin_id: string;
  name: string;
  min_value: number;
  max_value: number;
  draw_date: string;
  reveal_date: string;
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
        'The minimum value cannot be greater than the maximum value or lesser than 0.',
        400,
      );
    }

    let parsed_reveal_date;
    let parsed_draw_date;

    if (reveal_date && draw_date) {
      parsed_reveal_date = parseISO(reveal_date);
      parsed_draw_date = parseISO(draw_date);

      if (isBefore(parsed_reveal_date, parsed_draw_date)) {
        throw new AppError(
          'The reveal date cannot happen before the draw date.',
          400,
        );
      }
    }

    const group = await this.groupRepository.create({
      name,
      max_value,
      min_value,
      reveal_date: parsed_reveal_date,
      draw_date: parsed_draw_date,
      admin_id: admin.id,
      status_flag: GroupStatus.Awaiting,
    });

    if (!group) {
      throw new AppError(
        'There was an error creating the group. Please try again.',
        400,
      );
    }

    await this.groupUsersRepository.addMember(group.id, admin.id);

    return group;
  }
}
