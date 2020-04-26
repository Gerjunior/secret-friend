import { Router } from 'express';

import AddUserToGroupService from '../services/AddUserToGroupService';
import RemoveUserFromGroupService from '../services/RemoveUserFromGroupService';

import UsersRepository from '../repositories/UsersRepository';

const usersRepository = new UsersRepository();
const groupMembersRouter = Router();

groupMembersRouter.post('/add/:nickname', async (request, response) => {
  const { nickname } = request.params;
  const id = request.group_id;

  const addUserToGroup = new AddUserToGroupService(usersRepository);

  const group = await addUserToGroup.execute({
    group_id: id,
    user_nickname: nickname,
  });

  return response.json(group);
});

groupMembersRouter.post('/remove/:nickname', async (request, response) => {
  const { nickname } = request.params;
  const id = request.group_id;

  const removeUserFromGroup = new RemoveUserFromGroupService();

  const group = await removeUserFromGroup.execute({
    group_id: id,
    user_nickname: nickname,
  });

  return response.json(group);
});

export default groupMembersRouter;
