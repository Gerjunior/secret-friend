import express, { Request, Response, NextFunction } from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import 'express-async-errors';

import AppError from './errors/AppError';

import routes from './routes';

const app = express();

app.use(cors());
app.use(express.json());
app.use(routes);

mongoose.connect(process.env.connectionString, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useFindAndModify: false,
  useCreateIndex: true,
});

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

// TODO: express validations
// TODO: tests
// TODO: JWT roles
