import { Router } from 'express';

import SessionsController from '../controllers/SessionsController';

import { validatePost } from './sessions.routes.validation';

const sessionsController = new SessionsController();
const sessionsRouter = Router();

sessionsRouter.post('/', validatePost, sessionsController.create);

export default sessionsRouter;
