import express from 'express';
import bodyParser from 'body-parser';
import cookieParser from 'cookie-parser';

import authRouter from './v1.0.0/router/auth';
import userRouter from './v1.0.0/router/user';
import * as errorController from './v1.0.0/controller/error';

const app = express();
app.use(bodyParser.json());
app.use(cookieParser());

app.use('/api/v1', authRouter);
app.use('/api/v1', userRouter);
app.use(errorController.uniqueIndexError);
app.use(errorController.generalHandler);

export default app;
