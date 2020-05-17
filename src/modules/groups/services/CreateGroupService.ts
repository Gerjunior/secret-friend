import { isBefore, parseISO } from 'date-fns';
import { injectable, inject } from 'tsyringe';

import groupSchema, {
  IGroupMembers,
} from '@modules/groups/infra/mongoose/schemas/Groups';
import AppError from '@shared/errors/AppError';

import IUsersRepository from '@modules/users/repositories/IUsersRepository';
import IUserGroupsRepository from '@modules/users/repositories/IUserGroupsRepository';

interface IRequest {
  admin_nickname: string;
  name: string;
  min_value: number;
  max_value: number;
  draw_date: string;
  reveal_date: string;
}

interface IResponse {
  id: string;
  name: string;
  status: string;
  admin_nickname: string;
  min_value: number;
  max_value: number;
  draw_date: Date;
  reveal_date: Date;
  members: [IGroupMembers];
}

@injectable()
export default class CreateGroupService {
  constructor(
    @inject('UsersRepository')
    private usersRepository: IUsersRepository,

    @inject('UserGroupsRepository')
    private userGroupsRepository: IUserGroupsRepository,
  ) {}

  public async execute({
    admin_nickname,
    name = 'UndefinedGroup',
    draw_date,
    reveal_date,
    max_value = Infinity,
    min_value = 0,
  }: IRequest): Promise<IResponse> {
    const admin = await this.usersRepository.findByNickname(admin_nickname);

    if (!admin) {
      throw new AppError('No user with this nickname could be found.', 404);
    }

    if (min_value > max_value) {
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

    const group = await groupSchema.create({
      name,
      max_value,
      min_value,
      reveal_date: parsed_reveal_date,
      draw_date: parsed_draw_date,
      admin_nickname,
      members: [admin],
    });

    await this.userGroupsRepository.addGroupToUser(group, admin_nickname);

    return {
      id: group.id,
      name,
      status: group.status,
      min_value,
      max_value,
      draw_date: group.draw_date,
      reveal_date: group.reveal_date,
      admin_nickname,
      members: group.members,
    };
  }
}