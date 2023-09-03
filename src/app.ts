import express from 'express';
import bodyParser from 'body-parser';
import cookieParser from 'cookie-parser';

import authRouter from './v1.0.0/router/auth';
import userRouter from './v1.0.0/router/user';
import listRouter from './v1.0.0/router/list';
import tagRouter from './v1.0.0/router/tag';
import stickyRouter from './v1.0.0/router/stickyNote';
import taskRouter from './v1.0.0/router/task';
import * as errorController from './v1.0.0/controller/error';
import 'dotenv/config';

const app = express();
app.use(bodyParser.json());
app.use(cookieParser(process.env.SIGNED_COOKIES_SECRET));

app.use('/api/v1', authRouter);
app.use('/api/v1', userRouter);
app.use('/api/v1', listRouter);
app.use('/api/v1', tagRouter);
app.use('/api/v1', stickyRouter);
app.use('/api/v1', taskRouter);
app.use(errorController.uniqueIndexError);
app.use(errorController.generalHandler);

export default app;
