import { Router } from 'express';

import GroupMembersController from '../controllers/GroupMembersController';

const groupMembersController = new GroupMembersController();
const groupMembersRouter = Router();

groupMembersRouter.post('/add/:nickname', groupMembersController.add);
groupMembersRouter.post('/remove/:nickname', groupMembersController.remove);

export default groupMembersRouter;
