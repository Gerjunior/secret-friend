import { Router } from 'express';

import ensureAuthenticated from '@modules/users/infra/http/middlewares/ensureAuthenticated';
import groupMembersRouter from './groups.members.routes';

import GroupsController from '../controllers/GroupsController';

const groupsController = new GroupsController();

const groupsRouter = Router();

groupsRouter.use(ensureAuthenticated);

groupsRouter.get('/', groupsController.get);
groupsRouter.post('/', groupsController.create);
groupsRouter.put('/:id', groupsController.update);
groupsRouter.delete('/:id', groupsController.delete);
groupsRouter.post('/:id/draw', groupsController.draw);

groupsRouter.use(
  '/:id/members',
  (request, response, next) => {
    const { id } = request.params;
    request.group_id = id;
    next();
  },
  groupMembersRouter,
);

export default groupsRouter;
