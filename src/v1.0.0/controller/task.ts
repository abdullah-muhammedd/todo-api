import { Request, Response, NextFunction } from 'express';
import moment from 'moment';
import TaskServices from '../services/task';
import { taskValidationSchema } from '../utility/_validation/task';
import ValidationError from '../utility/_error/ValidationError';
import { BAD_REQUEST, UNPROCESSABLE_ENTITY } from '../utility/_types/statusCodes';

/**
 *  Get a specific task by its ID.
 */
export async function getTask(req: Request, res: Response, next: NextFunction) {
    try {
        const userId = res.locals.userId;
        const task = await TaskServices.get(req.params.id, userId);
        return res.status(200).json({ message: 'Task Found Successfully', task });
    } catch (error) {
        return next(error);
    }
}

/**
 *  Get a paginated list of all tasks.
 */
export async function getTasks(req: Request, res: Response, next: NextFunction) {
    try {
        const userID = res.locals.userId;
        const page: string = req.query.page as string;
        const perPage: string = req.query.perPage as string;

        // Format the dates
        // prettier-ignore
        const dueDateFrom = req.query.dueDateFrom
            ? moment(req.query.dueDateFrom as string)
                .format('YYYY-MM-DD')
            : null;
        // prettier-ignore
        const dueDateTo = req.query.dueDateTo
            ? moment(req.query.dueDateTo as string)
                .format('YYYY-MM-DD')
            : null;

        const done = req.query.done ? (req.query.done as string).toLowerCase() === 'true' : null;
        const tasks = await TaskServices.getAll(+perPage, +page, { userID, dueDateFrom, dueDateTo, done });
        return res.status(200).json({ message: 'Tasks Found Successfully', tasks });
    } catch (error) {
        return next(error);
    }
}

/**
 *  Create a new task.
 */
export async function postTask(req: Request, res: Response, next: NextFunction) {
    try {
        const userId = res.locals.userId;
        const taskBody = validate(req.body);
        taskBody.userID = userId;
        await TaskServices.add(taskBody);
        return res.status(200).json({ message: 'Task Added Successfully' });
    } catch (error) {
        return next(error);
    }
}

/**
 *  Update an existing task by its ID.
 */
export async function patchTask(req: Request, res: Response, next: NextFunction) {
    try {
        const userId = res.locals.userId;
        const taskId = req.params.id;
        const taskBody = validate(req.body);
        const modifiedCount: number = await TaskServices.update(taskId, taskBody, userId);
        return res.status(200).json({ message: 'Task Updated Successfully', modifiedCount });
    } catch (error) {
        return next(error);
    }
}

/**
 *  Delete a task by its ID.
 */
export async function deleteTask(req: Request, res: Response, next: NextFunction) {
    try {
        const userId = res.locals.userId;
        const taskId = req.params.id;
        const deletedCount: number = await TaskServices.remove(taskId, userId);
        return res.status(200).json({ message: 'Task Deleted Successfully', deletedCount });
    } catch (error) {
        return next(error);
    }
}

/**
 *  Toogle on the done status of the task
 */
export async function patchToggleDone(req: Request, res: Response, next: NextFunction) {
    try {
        const userId = res.locals.userId;
        const taskId = req.params.id;
        const modifiedCount: number = await TaskServices.changeDoneStatus(taskId, userId);
        return res.status(200).json({ message: 'Task Updated Successfully', modifiedCount });
    } catch (error) {
        return next(error);
    }
}

/**
 *  Get a paginated list of all tasks specified by list id .
 */
export async function getTasksByList(req: Request, res: Response, next: NextFunction) {
    try {
        const userID = res.locals.userId;
        const page: string = req.query.page as string;
        const perPage: string = req.query.perPage as string;
        const listID: string = req.params.listId as string;

        const tasks = await TaskServices.getAllByList(+perPage, +page, userID, listID);
        return res.status(200).json({ message: 'Tasks Found Successfully', tasks });
    } catch (error) {
        return next(error);
    }
}

/**
 *  Get a paginated list of all tasks specified by tag id.
 */
export async function getTasksByTag(req: Request, res: Response, next: NextFunction) {
    try {
        const userID = res.locals.userId;
        const page: string = req.query.page as string;
        const perPage: string = req.query.perPage as string;
        const tagID: string = req.params.tagId as string;

        const tasks = await TaskServices.getAllByTag(+perPage, +page, userID, tagID);
        return res.status(200).json({ message: 'Tasks Found Successfully', tasks });
    } catch (error) {
        return next(error);
    }
}

// helpers
function validate(body: any) {
    const { error, value } = taskValidationSchema.validate(body);
    if (error) {
        let statusCode = UNPROCESSABLE_ENTITY;
        if (error.details[0].type === 'any.required') {
            statusCode = BAD_REQUEST;
        }
        throw new ValidationError(error.message, statusCode);
    }
    return value;
}
