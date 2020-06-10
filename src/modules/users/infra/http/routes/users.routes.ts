import { Router } from 'express';

import UsersController from '../controllers/UsersController';
import ensureAuthenticated from '../middlewares/ensureAuthenticated';

import {
  validateGet,
  validatePost,
  validatePut,
} from './users.routes.validation';

const usersRouter = Router();

const usersController = new UsersController();

usersRouter.get('/:user_id', validateGet, usersController.getById);
usersRouter.post('/', validatePost, usersController.create);
usersRouter.put('/', validatePut, ensureAuthenticated, usersController.update);
usersRouter.delete('/', ensureAuthenticated, usersController.delete);

export default usersRouter;
