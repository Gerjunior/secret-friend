import { Router } from 'express';

import groupMembersRouter from './groups.members.routes';

const groupsRouter = Router();

groupsRouter.get('/', (request, response) => {
  // TODO
});

groupsRouter.post('/', (request, response) => {
  // TODO
});

groupsRouter.put('/:_id', (request, response) => {
  // TODO
});

groupsRouter.delete('/:id', (request, response) => {
  // TODO
});

groupsRouter.post('/:_id/draw', (request, response) => {
  // TODO
});

groupsRouter.use('/:_id/members', groupMembersRouter);

export default groupsRouter;
