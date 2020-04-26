import { Router } from 'express';

import usersRouter from './users.routes';
import groupsRouter from './groups.routes';
import sessionsRouter from './sessions.routes';

const routes = Router();

routes.use('/users', usersRouter);
routes.use('/groups', groupsRouter);
routes.use('/sessions', sessionsRouter);

export default routes;
