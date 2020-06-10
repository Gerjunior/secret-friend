import { Request, Response } from 'express';
import { container } from 'tsyringe';
import { classToClass } from 'class-transformer';

import CreateGroupService from '@modules/groups/services/CreateGroupService';
import UpdateGroupService from '@modules/groups/services/UpdateGroupService';
import ShowGroupService from '@modules/groups/services/ShowGroupService';
import DeleteGroupService from '@modules/groups/services/DeleteGroupService';

export default class GroupsController {
  public async findById(
    request: Request,
    response: Response,
  ): Promise<Response> {
    const { group_id } = request.params;

    const showGroup = container.resolve(ShowGroupService);

    const group = await showGroup.execute(group_id);

    return response.json(group);
  }

  public async create(request: Request, response: Response): Promise<Response> {
    const { id } = request.user;

    const { name, min_value, max_value, draw_date, reveal_date } = request.body;

    const createGroup = container.resolve(CreateGroupService);

    const group = await createGroup.execute({
      admin_id: id,
      name,
      min_value,
      max_value,
      draw_date,
      reveal_date,
    });

    return response.status(201).json(classToClass(group));
  }

  public async update(request: Request, response: Response): Promise<Response> {
    const { id } = request.user;
    const { group_id } = request.params;
    const { name, min_value, max_value, draw_date, reveal_date } = request.body;

    const updateGroup = container.resolve(UpdateGroupService);

    const group = await updateGroup.execute({
      group_id,
      admin_id: id,
      name,
      min_value,
      max_value,
      draw_date,
      reveal_date,
    });

    // TODO: Return the full object

    return response.json(classToClass(group));
  }

  public async delete(request: Request, response: Response): Promise<Response> {
    const admin_id = request.user.id;
    const group_id = request.params.id;

    const deleteGroup = container.resolve(DeleteGroupService);

    await deleteGroup.execute({ admin_id, group_id });

    return response.status(204).send();
  }
}
