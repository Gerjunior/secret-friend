import groupSchema, { IGroup, Status } from '../models/Groups';

import AppError from '../errors/AppError';

class DrawService {
  public async execute(group_id: string): Promise<IGroup> {
    const group = await groupSchema.findById(group_id);

    if (!group) {
      throw new AppError('Group not found.', 404);
    }

    if (group.status !== Status.Awaiting) {
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
        nickname: member.nickname,
        secret_friend: '',
        already_chosen: false,
      };
    });

    for (let i = 0; i < drawObject.length; i += 1) {
      while (!drawObject[i].secret_friend) {
        const secret_friend =
          drawObject[Math.floor(Math.random() * drawObject.length)];

        if (
          drawObject[i].nickname === secret_friend.nickname ||
          secret_friend.already_chosen
        ) {
          continue;
        }

        drawObject[i].secret_friend = secret_friend.nickname;
        const secret_friend_index = group.members.findIndex(
          member => member.nickname === secret_friend.nickname,
        );
        drawObject[secret_friend_index].already_chosen = true;
      }
    }

    const draw_result = drawObject.map(user => {
      return { nickname: user.nickname, secret_friend: user.secret_friend };
    });

    group.members.forEach(member => {
      const draw_result_item = draw_result.find(
        item => item.nickname === member.nickname,
      );

      if (!draw_result_item) {
        throw new AppError(
          'This error should never occur. Just here because of TypeScript rules.',
          400,
        );
      }

      const secret_friend = group.members.find(
        user => user.nickname === draw_result_item.secret_friend,
      );

      if (!secret_friend) {
        throw new AppError(
          'This error should never occur. Just here because of TypeScript rules.',
          400,
        );
      }

      member.secret_friend = secret_friend.nickname;
    });

    group.status = Status.Drawn;
    group.draw_date = new Date();

    const updatedGroup = await groupSchema.findByIdAndUpdate(group_id, group, {
      new: true,
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

export default DrawService;
