import { Router } from 'express';

import GroupUsersController from '../controllers/GroupUsersController';

const groupUsersController = new GroupUsersController();
const GroupUsersRouter = Router();

GroupUsersRouter.post('/add', groupUsersController.add);
GroupUsersRouter.post('/remove', groupUsersController.remove);

export default GroupUsersRouter;
