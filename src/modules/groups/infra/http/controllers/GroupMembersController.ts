import { Request, Response } from 'express';
import { container } from 'tsyringe';
import { classToClass } from 'class-transformer';

import AddUserToGroupService from '@modules/groups/services/AddUserToGroupService';
import RemoveUserFromGroupService from '@modules/groups/services/RemoveUserFromGroupService';

export default class GroupMembersController {
  public async add(request: Request, response: Response): Promise<Response> {
    const { group_id, user_id } = request.body;

    // TODO: Verify if the request is being made by the group adm

    const addUserToGroup = container.resolve(AddUserToGroupService);

    const group = await addUserToGroup.execute({
      group_id,
      user_id,
    });

    return response.json(classToClass(group));
  }

  public async remove(request: Request, response: Response): Promise<Response> {
    const { group_id, user_id } = request.body;

    // TODO: Verify if the request is being made by the group adm

    const removeUserFromGroup = container.resolve(RemoveUserFromGroupService);

    await removeUserFromGroup.execute({
      group_id,
      user_id,
    });

    return response.send();
  }
}
