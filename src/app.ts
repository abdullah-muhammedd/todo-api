import express from 'express';
import bodyParser from 'body-parser';
import cookieParser from 'cookie-parser';

import authRouter from './v1.0.0/router/auth';
import userRouter from './v1.0.0/router/user';
import listRouter from './v1.0.0/router/list';
import tagRouter from './v1.0.0/router/tag';
import stickyRouter from './v1.0.0/router/stickyNote';
import * as errorController from './v1.0.0/controller/error';

const app = express();
app.use(bodyParser.json());
app.use(cookieParser());

app.use('/api/v1', authRouter);
app.use('/api/v1', userRouter);
app.use('/api/v1', listRouter);
app.use('/api/v1', tagRouter);
app.use('/api/v1', stickyRouter);
app.use(errorController.uniqueIndexError);
app.use(errorController.generalHandler);

export default app;
