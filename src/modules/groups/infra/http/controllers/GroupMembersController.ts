import { Request, Response } from 'express';
import { container } from 'tsyringe';

import AddUserToGroupService from '@modules/groups/services/AddUserToGroupService';
import RemoveUserFromGroupService from '@modules/groups/services/RemoveUserFromGroupService';

export default class GroupMembersController {
  public async add(request: Request, response: Response): Promise<Response> {
    const { nickname } = request.params;
    const id = request.group_id;

    const addUserToGroup = container.resolve(AddUserToGroupService);

    const group = await addUserToGroup.execute({
      group_id: id,
      user_nickname: nickname,
    });

    return response.json(group);
  }

  public async remove(request: Request, response: Response): Promise<Response> {
    const { nickname } = request.params;
    const id = request.group_id;

    const removeUserFromGroup = container.resolve(RemoveUserFromGroupService);

    const group = await removeUserFromGroup.execute({
      group_id: id,
      user_nickname: nickname,
    });

    return response.json(group);
  }
}
