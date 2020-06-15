import 'reflect-metadata';
import 'dotenv/config';

import cors from 'cors';
import helmet from 'helmet';
import express, { Request, Response, NextFunction } from 'express';
import 'express-async-errors';
import { isCelebrate } from 'celebrate';

import '@shared/infra/typeorm';
import '@shared/container';

import AppError from '@shared/errors/AppError';
import rateLimiter from '@shared/infra/http/middlewares/rateLimiter';
import routes from './routes';

const app = express();

app.use(rateLimiter);
app.use(cors());
app.use(helmet());
app.use(express.json());
app.use(routes);

app.use((err: Error, request: Request, response: Response, _: NextFunction) => {
  if (err instanceof AppError) {
    return response.status(err.statusCode).json({
      status: 'error',
      message: err.message,
    });
  }

  if (isCelebrate(err)) {
    return response.status(400).json({
      status: 'validationError',
      message: err.message,
    });
  }

  console.error(err);

  return response.status(500).json({
    status: 'error',
    message: 'Internal server error',
  });
});

app.listen(process.env.PORT || 3333, () => {
  console.log('(☞ﾟヮﾟ)☞ App listening on port 3333! ☜(ﾟヮﾟ☜)');
});

// TODO: tests (jest)
// TODO: transactions
// TODO: rate limit
