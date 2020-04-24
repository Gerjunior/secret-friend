import { Router } from 'express';

import groupSchema from '../models/Groups';
import AppError from '../errors/AppError';

import AddUserToGroupService from '../services/AddUserToGroupService';
import RemoveUserFromGroupService from '../services/RemoveUserFromGroupService';

const groupMembersRouter = Router();

groupMembersRouter.get('/', async (request, response) => {
  const { id } = request.group;

  const group = await groupSchema.findById(id);

  if (!group) {
    throw new AppError('Group not found.', 404);
  }

  return response.json(group.members);
});

groupMembersRouter.post('/add/:nickname', async (request, response) => {
  const { nickname } = request.params;
  const { id } = request.group;

  const addUserToGroup = new AddUserToGroupService();

  const group = await addUserToGroup.execute(id, nickname);

  return response.json(group);
});

groupMembersRouter.delete('/remove/:nickname', async (request, response) => {
  const { nickname } = request.params;
  const { id } = request.group;

  const removeUserFromGroup = new RemoveUserFromGroupService();

  const group = await removeUserFromGroup.execute(id, nickname);

  return response.json(group);
});

export default groupMembersRouter;
