import { injectable, inject } from 'tsyringe';

import Group from '@modules/groups/infra/typeorm/entities/Group';
import GroupStatus from '@modules/groups/entities/enums/GroupStatus';

import AppError from '@shared/errors/AppError';

import IGroupRepository from '@modules/groups/repositories/IGroupRepository';
import ISecretFriendRepository from '../repositories/ISecretFriendRepository';
import IGroupUsersRepository from '../repositories/IGroupUsersRepository';

import GroupUser from '../infra/typeorm/entities/GroupUser';

interface IRequest {
  admin_id: string;
  group_id: string;
}

interface DrawResult {
  id: string;
  secret_friend: string;
}

@injectable()
export default class DrawService {
  constructor(
    @inject('GroupRepository')
    private groupRepository: IGroupRepository,

    @inject('GroupUsersRepository')
    private groupUsersRepository: IGroupUsersRepository,

    @inject('SecretFriendRepository')
    private secretFriendRepository: ISecretFriendRepository,
  ) {}

  public async execute({ group_id, admin_id }: IRequest): Promise<Group> {
    const group = await this.groupRepository.findById(group_id);

    if (!group) {
      throw new AppError('Group not found.', 404);
    }

    if (group.admin_id !== admin_id) {
      throw new AppError('You are not allowed to realize the draw.');
    }

    if (group.status_flag !== GroupStatus.Awaiting) {
      throw new AppError(
        'The draw has already been carried out for this group.',
        400,
      );
    }

    const groupUsers = await this.groupUsersRepository.findByGroupId(group_id);

    if (!groupUsers || groupUsers.length < 3) {
      throw new AppError('You need at least 3 members to start the draw!');
    }

    const drawObject = groupUsers.map(member => {
      return {
        id: member.user_id,
        secret_friend: '',
        already_chosen: false,
      };
    });

    drawObject.forEach(member => {
      while (!member.secret_friend) {
        const secret_friend =
          drawObject[Math.floor(Math.random() * drawObject.length)];

        if (
          member.id === secret_friend.id ||
          secret_friend.already_chosen ||
          member.id === secret_friend.secret_friend
        ) {
          continue;
        }

        member.secret_friend = secret_friend.id;

        const secret_friend_index = groupUsers.findIndex(
          findUser => findUser.user_id === secret_friend.id,
        );

        drawObject[secret_friend_index].already_chosen = true;
      }
    });

    const draw_result = drawObject.map(user => {
      return { id: user.id, secret_friend: user.secret_friend };
    });

    groupUsers.forEach(async member => {
      const draw_result_item = draw_result.find(
        item => item.id === member.user_id,
      ) as DrawResult;

      const secret_friend = (await this.groupUsersRepository.findByUserAndGroupIds(
        group_id,
        draw_result_item.secret_friend,
      )) as GroupUser;

      await this.secretFriendRepository.updateSecretFriend({
        group_id,
        user_id: member.user_id,
        secret_friend_id: secret_friend.user_id,
      });
    });

    const updatedGroup = await this.groupRepository.update({
      id: group_id,
      draw_date: new Date(),
      status_flag: GroupStatus.Drawn,
    });

    return updatedGroup as Group;
  }
}
