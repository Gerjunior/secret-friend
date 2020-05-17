import { Router } from 'express';

import usersRouter from '@modules/users/infra/http/routes/users.routes';
import groupsRouter from '@modules/groups/infra/http/routes/groups.routes';
import sessionsRouter from '@modules/users/infra/http/routes/sessions.routes';

const routes = Router();

routes.use('/users', usersRouter);
routes.use('/groups', groupsRouter);
routes.use('/sessions', sessionsRouter);

export default routes;
