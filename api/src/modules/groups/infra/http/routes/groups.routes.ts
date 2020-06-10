import { Router } from 'express';

import ensureAuthenticated from '@modules/users/infra/http/middlewares/ensureAuthenticated';
import GroupUsersRouter from './groups.members.routes';

import GroupsController from '../controllers/GroupsController';
import DrawController from '../controllers/DrawController';

import {
  validateGet,
  validatePost,
  validatePut,
  validateDelete,
  validateDraw,
} from './groups.routes.validation';

const groupsController = new GroupsController();
const drawController = new DrawController();

const groupsRouter = Router();

groupsRouter.use(ensureAuthenticated);

groupsRouter.get('/:id', validateGet, groupsController.findById);
groupsRouter.post('/', validatePost, groupsController.create);
groupsRouter.put('/:id', validatePut, groupsController.update);
groupsRouter.delete('/:id', validateDelete, groupsController.delete);

groupsRouter.post('/:id/draw', validateDraw, drawController.draw);

groupsRouter.use('/members', GroupUsersRouter);

export default groupsRouter;
