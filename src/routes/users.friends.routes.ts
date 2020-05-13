import { Router } from 'express';

import UserFriendsController from '../controllers/UserFriendsController';

const userFriendsRouter = Router();
const userFriendsController = new UserFriendsController();

userFriendsRouter.post('/add/:user_nickname', userFriendsController.add);
userFriendsRouter.post('/remove/:user_nickname', userFriendsController.remove);

export default userFriendsRouter;
