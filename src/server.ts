import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import 'express-async-errors';

import routes from './routes';
import errorHandler from './middlewares/errorHandler';

const app = express();

app.use(cors());
app.use(express.json());
app.use(routes);

app.use(errorHandler);

mongoose.connect(process.env.connectionString || '', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useFindAndModify: false,
  useCreateIndex: true,
});

app.listen(3333, () => {
  console.log('(☞ﾟヮﾟ)☞ App listening on port 3333! ☜(ﾟヮﾟ☜)');
});
