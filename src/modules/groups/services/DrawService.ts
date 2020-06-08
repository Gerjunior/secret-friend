import { injectable, inject } from 'tsyringe';

import Group from '@modules/groups/infra/typeorm/entities/Group';
import GroupStatus from '@modules/groups/entities/enums/GroupStatus';

import AppError from '@shared/errors/AppError';

import IGroupRepository from '@modules/groups/repositories/IGroupRepository';
import IGroupUsersRepository from '../repositories/IGroupUsersRepository';
import GroupUser from '../infra/typeorm/entities/GroupUser';

interface IRequest {
  user_id: string;
  group_id: string;
}
@injectable()
export default class DrawService {
  constructor(
    @inject('GroupRepository')
    private groupRepository: IGroupRepository,

    @inject('GroupUsersRepository')
    private groupUsersRepository: IGroupUsersRepository,
  ) {}

  public async execute({ group_id, user_id }: IRequest): Promise<Group> {
    const group = await this.groupRepository.findById(group_id);

    if (!group) {
      throw new AppError('Group not found.', 404);
    }

    if (group.admin_id !== user_id) {
      throw new AppError('You are not allowed to realize the draw.');
    }

    if (group.status_flag !== GroupStatus.Awaiting) {
      throw new AppError(
        'The draw has already been carried out for this group.',
        400,
      );
    }

    if (group.members.length < 3) {
      throw new AppError('You need at least 3 members to start the draw!');
    }

    const drawObject = group.members.map(member => {
      return {
        id: member.user.id,
        secret_friend: '',
        already_chosen: false,
      };
    });

    for (let i = 0; i < drawObject.length; i += 1) {
      while (!drawObject[i].secret_friend) {
        const secret_friend =
          drawObject[Math.floor(Math.random() * drawObject.length)]; // GET A RANDOM INDEX FROM DRAWOBJECT

        if (
          drawObject[i].id === secret_friend.id || // VERIFY IF THE SELECTED SECRET FRIEND ID IS NOT THE SAME AS THE FIRST USER
          secret_friend.already_chosen // VERIFY IF THE SELECTED SECRET FRIEND IS NOT ALREALDY CHOSEN
        ) {
          continue;
        }

        drawObject[i].secret_friend = secret_friend.id;

        const secret_friend_index = group.members.findIndex(
          member => member.user.id === secret_friend.id,
        );
        drawObject[secret_friend_index].already_chosen = true;
      }
    }

    const draw_result = drawObject.map(user => {
      return { id: user.id, secret_friend: user.secret_friend };
    });

    group.members.forEach(async member => {
      const draw_result_item = draw_result.find(
        item => item.id === member.user.id,
      );

      if (!draw_result_item) {
        throw new AppError(
          'This error should never occur. Just here because of TypeScript rules.',
          400,
        );
      }

      const secret_friend = group.members.find(
        user => user.user_id === draw_result_item.secret_friend,
      ) as GroupUser;

      await this.groupUsersRepository.updateSecretFriend({
        group_id,
        user_id: member.user_id,
        secret_friend_id: secret_friend.user_id,
      });
    });

    const updatedGroup = await this.groupRepository.update({
      group_id,
      draw_date: new Date(),
      status: GroupStatus.Drawn,
    });

    if (!updatedGroup) {
      throw new AppError(
        'An unexpected error happened. Please try again.',
        400,
      );
    }

    return updatedGroup;
  }
}
