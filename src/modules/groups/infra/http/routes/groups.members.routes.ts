import { Router } from 'express';

import GroupMembersController from '../controllers/GroupMembersController';

const groupMembersController = new GroupMembersController();
const groupMembersRouter = Router();

groupMembersRouter.post('/add', groupMembersController.add);
groupMembersRouter.post('/remove', groupMembersController.remove);

export default groupMembersRouter;
