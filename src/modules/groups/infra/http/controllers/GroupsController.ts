import { Request, Response } from 'express';
import isNumber from 'is-number';
import cleanDeep from 'clean-deep';
import { container } from 'tsyringe';

import CreateGroupService from '@modules/groups/services/CreateGroupService';
import UpdateGroupService from '@modules/groups/services/UpdateGroupService';
import DrawService from '@modules/groups/services/DrawService';
import AppError from '@shared/errors/AppError';
import groupSchema from '../../mongoose/schemas/Groups';

export default class GroupsController {
  public async get(request: Request, response: Response): Promise<Response> {
    const { page } = request.query;

    const {
      group_id,
      name,
      min_value,
      max_value,
      draw_date,
      reveal_date,
      status,
    } = request.body;

    const convertedPage = isNumber(page) ? Number(page) : 1;

    const group = await groupSchema.paginate(
      cleanDeep({
        _id: group_id,
        name,
        min_value,
        max_value,
        draw_date,
        reveal_date,
        status,
      }),
      { page: convertedPage, limit: 10 },
    );

    if (group.docs.length === 0) {
      throw new AppError('No groups found with those parameters', 404);
    }

    return response.json(group);
  }

  public async create(request: Request, response: Response): Promise<Response> {
    const {
      admin_nickname,
      name,
      min_value,
      max_value,
      draw_date,
      reveal_date,
    } = request.body;

    const createGroup = container.resolve(CreateGroupService);

    const group = await createGroup.execute({
      admin_nickname,
      name,
      min_value,
      max_value,
      draw_date,
      reveal_date,
    });

    return response.status(201).json(group);
  }

  public async update(request: Request, response: Response): Promise<Response> {
    const { id } = request.params;
    const { name, min_value, max_value, draw_date, reveal_date } = request.body;

    const updateGroup = new UpdateGroupService();

    const group = await updateGroup.execute({
      id,
      name,
      min_value,
      max_value,
      draw_date,
      reveal_date,
    });

    return response.json(group);
  }

  public async delete(request: Request, response: Response): Promise<Response> {
    const { id } = request.params;

    const group = await groupSchema.findByIdAndDelete(id);

    if (!group) {
      throw new AppError('No group was found with this id.', 404);
    }

    return response.status(204).send();
  }

  public async draw(request: Request, response: Response): Promise<Response> {
    const { id } = request.params;

    const draw = new DrawService();

    const group = await draw.execute(id);

    return response.json(group);
  }
}
