import { Router } from 'express';

import ensureAuthenticated from '@modules/users/infra/http/middlewares/ensureAuthenticated';
import GroupUsersRouter from './groups.members.routes';

import GroupsController from '../controllers/GroupsController';
import DrawController from '../controllers/DrawController';

const groupsController = new GroupsController();
const drawController = new DrawController();

const groupsRouter = Router();

groupsRouter.use(ensureAuthenticated);

groupsRouter.get('/:id', groupsController.findById);
groupsRouter.post('/', groupsController.create);
groupsRouter.put('/:id', groupsController.update);
groupsRouter.delete('/:id', groupsController.delete);

groupsRouter.post('/:id/draw', drawController.draw);

groupsRouter.use('/members', GroupUsersRouter);

export default groupsRouter;
