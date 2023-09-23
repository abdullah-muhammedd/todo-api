import express, { Request, Response, NextFunction } from 'express';
import bodyParser from 'body-parser';
import cookieParser from 'cookie-parser';
import helmet from 'helmet';

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
app.use(helmet());
// Handling CORS
app.use((req: Request, res: Response, next: NextFunction): Response | void => {
    res.header('Access-Control-Allow-Credentials', 'true');
    res.header('Access-Control-Allow-Origin', 'http://localhost:5173');
    res.header('Access-Control-Allow-Methods', 'GET, PATCH, POST, DELETE');
    res.header('Access-Control-Allow-Headers', 'Content-Type');

    if (req.method === 'OPTIONS') {
        res.status(204).end();
    } else {
        next();
    }
});

app.use('/api/v1', authRouter);
app.use('/api/v1', userRouter);
app.use('/api/v1', listRouter);
app.use('/api/v1', tagRouter);
app.use('/api/v1', stickyRouter);
app.use('/api/v1', taskRouter);
app.use(errorController.uniqueIndexError);
app.use(errorController.generalHandler);
app.use(errorController.notFoundHandler);
export default app;
