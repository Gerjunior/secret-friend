import { Router } from 'express';

import DrawController from '../controllers/DrawController';
import { validateDraw } from './group.draw.routes.validation';

const drawRouter = Router();

const drawController = new DrawController();

drawRouter.post('/:id/draw', validateDraw, drawController.draw);

export default drawRouter;
