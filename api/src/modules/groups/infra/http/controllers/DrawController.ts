import { Request, Response } from 'express';
import { container } from 'tsyringe';
import { classToClass } from 'class-transformer';

import DrawService from '@modules/groups/services/DrawService';

export default class GroupsController {
  public async draw(request: Request, response: Response): Promise<Response> {
    const user_id = request.user.id;
    const group_id = request.params.id;

    const draw = container.resolve(DrawService);

    const group = await draw.execute({ user_id, group_id });

    return response.json(classToClass(group));
  }
}
