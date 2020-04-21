import { Router } from 'express';

const groupMembersRouter = Router();

groupMembersRouter.post('/add/:user_nick', (request, response) => {
  // TODO
});

groupMembersRouter.post('/remove/:user_nick', (request, response) => {
  // TODO
});

export default groupMembersRouter;
