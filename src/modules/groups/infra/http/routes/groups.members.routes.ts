import { Router } from 'express';

import GroupUsersController from '../controllers/GroupUsersController';

import { validateRemove, validateAdd } from './groups.users.routes.validation';

const groupUsersController = new GroupUsersController();
const groupUsersRouter = Router();

groupUsersRouter.post('/add', validateAdd, groupUsersController.add);
groupUsersRouter.post('/remove', validateRemove, groupUsersController.remove);

export default groupUsersRouter;
