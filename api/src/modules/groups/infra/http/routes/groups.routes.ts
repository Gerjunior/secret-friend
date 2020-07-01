import { Router } from 'express';

import ensureAuthenticated from '@modules/users/infra/http/middlewares/ensureAuthenticated';
import GroupMembersRouter from './group.members.routes';
import GroupDrawRouter from './group.draw.routes';

import GroupsController from '../controllers/GroupsController';

import {
  validateGet,
  validatePost,
  validatePut,
  validateDelete,
} from './groups.routes.validation';

const groupsController = new GroupsController();

const groupsRouter = Router();

groupsRouter.use(ensureAuthenticated);

groupsRouter.use('/members', GroupMembersRouter);
groupsRouter.use(GroupDrawRouter);

groupsRouter.get('/:id', validateGet, groupsController.findById);
groupsRouter.post('/', validatePost, groupsController.create);
groupsRouter.put('/:id', validatePut, groupsController.update);
groupsRouter.delete('/:id', validateDelete, groupsController.delete);

export default groupsRouter;
