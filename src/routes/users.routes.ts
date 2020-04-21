import { Router } from 'express';

import userFriendsRouter from './users.friends.routes';

const usersRouter = Router();

usersRouter.get('/', (request, response) => {
  // TODO
});

usersRouter.post('/', (request, response) => {
  // TODO
});

usersRouter.put('/:_id', (request, response) => {
  // TODO
});

usersRouter.delete('/:id', (request, response) => {
  // TODO
});

usersRouter.use('/:_id/friends', userFriendsRouter);

export default usersRouter;
