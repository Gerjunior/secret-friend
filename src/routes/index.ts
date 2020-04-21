import { Router } from 'express';

import usersRouter from './users.routes';
import groupsRouter from './groups.routes';

const routes = Router();

routes.use('/users', usersRouter);
routes.use('/groups', groupsRouter);

export default routes;
