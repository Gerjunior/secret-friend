import { Router } from 'express';

import userFriendsRouter from './users.friends.routes';
import UsersController from '../controllers/UsersController';
import ensureAuthenticated from '../middlewares/ensureAuthenticated';

const usersController = new UsersController();
const usersRouter = Router();

usersRouter.get('/', ensureAuthenticated, usersController.getAll);
usersRouter.get(
  '/:nickname',
  ensureAuthenticated,
  usersController.getByNickname,
);
usersRouter.post('/', usersController.create);
usersRouter.put('/:id', ensureAuthenticated, usersController.update);
usersRouter.delete('/:id', ensureAuthenticated, usersController.delete);

usersRouter.use(
  '/:my_nickname/friends',
  (request, response, next) => {
    const { my_nickname } = request.params;
    request.user_nickname = my_nickname;
    next();
  },
  userFriendsRouter,
);

export default usersRouter;
