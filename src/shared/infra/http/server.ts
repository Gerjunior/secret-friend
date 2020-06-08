import 'reflect-metadata';
import 'dotenv/config';

import cors from 'cors';
import express, { Request, Response, NextFunction } from 'express';
import 'express-async-errors';

import '@shared/infra/typeorm';
import '@shared/container';

import AppError from '@shared/errors/AppError';
import routes from './routes';

const app = express();

app.use(cors());
app.use(express.json());
app.use(routes);

app.use((err: Error, request: Request, response: Response, _: NextFunction) => {
  if (err instanceof AppError) {
    return response.status(err.statusCode).json({
      status: 'error',
      message: err.message,
    });
  }

  console.error(err);

  return response.status(500).json({
    status: 'error',
    message: 'Internal server error',
  });
});

app.listen(3333, () => {
  console.log('(☞ﾟヮﾟ)☞ App listening on port 3333! ☜(ﾟヮﾟ☜)');
});

// TODO: celebrate
// TODO: tests (jest)
// TODO: JWT roles
// TODO: helmet
