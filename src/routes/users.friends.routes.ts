import { Router } from 'express';

const userFriendsRouter = Router();

userFriendsRouter.post('/add/:user_nick', (request, response) => {
  // TODO
});

userFriendsRouter.post('/remove/:user_nick', (request, response) => {
  // TODO
});

export default userFriendsRouter;
