import { Request, Response } from 'express';
import { container, injectable } from 'tsyringe';
import { classToClass } from 'class-transformer';

import CreateGroupService from '@modules/groups/services/CreateGroupService';
import UpdateGroupService from '@modules/groups/services/UpdateGroupService';
import ShowGroupService from '@modules/groups/services/ShowGroupService';

import DrawService from '@modules/groups/services/DrawService';

@injectable()
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
    const {
      admin_id,
      name,
      min_value,
      max_value,
      draw_date,
      reveal_date,
    } = request.body;

    const createGroup = container.resolve(CreateGroupService);

    const group = await createGroup.execute({
      admin_id,
      name,
      min_value,
      max_value,
      draw_date,
      reveal_date,
    });

    return response.status(201).json(classToClass(group));
  }

  public async update(request: Request, response: Response): Promise<Response> {
    const { id } = request.params;
    const { name, min_value, max_value, draw_date, reveal_date } = request.body;

    const updateGroup = container.resolve(UpdateGroupService);

    const group = await updateGroup.execute({
      id,
      name,
      min_value,
      max_value,
      draw_date,
      reveal_date,
    });

    return response.json(classToClass(group));
  }

  public async delete(request: Request, response: Response): Promise<Response> {
    const { id } = request.params;

    // const group = await this.GroupRepository.delete(id);

    // if (!group) {
    //   throw new AppError('No group was found with this id.', 404);
    // }

    return response.status(204).send();
  }

  public async draw(request: Request, response: Response): Promise<Response> {
    const { id } = request.params;

    const draw = container.resolve(DrawService);

    const group = await draw.execute(id);

    return response.json(classToClass(group));
  }
}
