import express from 'express';
import 'express-async-errors';
import { handleError } from './utils/error';
import './utils/db';
import { config } from './config/config';

const app = express();

app.use(handleError);

app.listen(config.port, '127.0.0.1', () =>
  console.log(`server is running on port ${config.port}`),
);
