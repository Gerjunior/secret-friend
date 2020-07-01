import { Router } from 'express';

import GroupMembersController from '../controllers/GroupMembersController';

import { validateRemove, validateAdd } from './group.members.routes.validation';

const groupMembersController = new GroupMembersController();
const groupMembersRouter = Router();

groupMembersRouter.post('/', validateAdd, groupMembersController.add);
groupMembersRouter.delete('/', validateRemove, groupMembersController.remove);

export default groupMembersRouter;
