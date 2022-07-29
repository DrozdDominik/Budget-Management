import express from 'express';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import helmet from 'helmet';
import 'express-async-errors';
import './utils/db';
import './auth/jwt.strategy';
import { config } from './config/config';
import { handleError, handleNotFound } from './utils/error';
import { userRouter } from './routers/user.router';
import { familyRouter } from './routers/family.router';
import { expenseRouter } from './routers/expense.router';
import { expenseLimiter, familyLimiter, userLimiter } from './utils/limiter';

const app = express();

app.use(cors({ origin: config.corsOrigin }));
app.use(helmet());
app.use('/user', userLimiter);
app.use('/user', expenseLimiter);
app.use('/user', familyLimiter);

app.use(express.json());
app.use(cookieParser());

app.use('/user', userRouter);
app.use('/family', familyRouter);
app.use('/expense', expenseRouter);

app.use(handleNotFound);

app.use(handleError);

app.listen(config.port, '127.0.0.1', () =>
  console.log(`server is running on port ${config.port}`),
);
