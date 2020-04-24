import { Router } from 'express';
import isNumber from 'is-number';
import cleanDeep from 'clean-deep';
import { Types } from 'mongoose';

import groupMembersRouter from './groups.members.routes';

import groupSchema from '../models/Groups';

import CreateGroupService from '../services/CreateGroupService';
import UpdateGroupService from '../services/UpdateGroupService';
import DrawService from '../services/DrawService';

import AppError from '../errors/AppError';

const groupsRouter = Router();

groupsRouter.get('/', async (request, response) => {
  const { page } = request.query;

  const {
    group_id,
    name,
    min_value,
    max_value,
    draw_date,
    reveal_date,
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
    }),
    { page: convertedPage, limit: 10 },
  );

  if (group.docs.length === 0) {
    throw new AppError('No groups found with those parameters', 404);
  }

  return response.json(group);
});

groupsRouter.post('/', async (request, response) => {
  const {
    admin_nickname,
    name,
    min_value,
    max_value,
    draw_date,
    reveal_date,
  } = request.body;

  const createGroup = new CreateGroupService();

  const group = await createGroup.execute({
    admin_nickname,
    name,
    min_value,
    max_value,
    draw_date,
    reveal_date,
  });

  return response.status(201).json(group);
});

groupsRouter.put('/:id', (request, response) => {
  const { id } = request.params;
  const { name, min_value, max_value, draw_date, reveal_date } = request.body;

  const updateGroup = new UpdateGroupService();

  const group = updateGroup.execute({
    id,
    name,
    min_value,
    max_value,
    draw_date,
    reveal_date,
  });

  return response.json(group);
});

groupsRouter.delete('/:id', async (request, response) => {
  const { id } = request.params;

  const group = await groupSchema.findByIdAndDelete(id);

  if (!group) {
    throw new AppError('No group was found with this id.', 404);
  }

  return response.status(204).send();
});

groupsRouter.post('/:id/draw', async (request, response) => {
  const { id } = request.params;

  const draw = new DrawService();

  const group = await draw.execute(id);

  return response.json(group);
});

groupsRouter.use(
  '/:id/members',
  (request, response, next) => {
    const { id } = request.params;
    request.group = {
      id,
    };
    next();
  },
  groupMembersRouter,
);

export default groupsRouter;
