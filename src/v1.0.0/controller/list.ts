import { Request, Response, NextFunction } from 'express';
import ListServices from '../services/list';
import { listValidationSchema } from '../utility/_validation/list';
import ValidationError from '../utility/_error/ValidationError';
import { BAD_REQUEST, UNPROCESSABLE_ENTITY } from '../utility/_types/statusCodes';
/**
 *  Get a specific list by its ID.
 */
export async function getList(req: Request, res: Response, next: NextFunction) {
    try {
        const userId = res.locals.userId;
        const list = await ListServices.get(req.params.id, userId);
        return res.status(200).json({ message: 'List Found Successfully', list });
    } catch (error) {
        return next(error);
    }
}

/**
 *  Get a paginated list of all lists.
 */
export async function getLists(req: Request, res: Response, next: NextFunction) {
    try {
        const userId = res.locals.userId;
        const page: string = (req.query.page as string) ?? '1';
        const perPage: string = (req.query.perPage as string) ?? '3';
        const lists = await ListServices.getAll(+perPage, +page, userId);
        return res.status(200).json({ message: 'Lists Found Successfully', lists });
    } catch (error) {
        return next(error);
    }
}

/**
 * Create a new list.
 */
export async function postList(req: Request, res: Response, next: NextFunction) {
    try {
        const userId = res.locals.userId;
        const listBody = validate(req.body);
        listBody.userID = userId;
        await ListServices.add(listBody);
        return res.status(200).json({ message: 'List Added Successfully' });
    } catch (error) {
        return next(error);
    }
}

/**
 *  Update an existing list by its ID.
 */
export async function patchList(req: Request, res: Response, next: NextFunction) {
    try {
        const userId = res.locals.userId;
        const listId = req.params.id;
        const listBody = validate(req.body);
        const modifiedCount: number = await ListServices.update(listId, listBody, userId);
        return res.status(200).json({ message: 'List Updated Successfully', modifiedCount });
    } catch (error) {
        return next(error);
    }
}

/**
 *  Delete a list by its ID.
 */
export async function deleteList(req: Request, res: Response, next: NextFunction) {
    try {
        const userId = res.locals.userId;
        const listId = req.params.id;
        const deletedCount: number = await ListServices.remove(listId, userId);
        return res.status(200).json({ message: 'List Deleted Successfully', deletedCount });
    } catch (error) {
        return next(error);
    }
}

// helpers
function validate(body: any) {
    const { error, value } = listValidationSchema.validate(body);
    if (error) {
        let statusCode = UNPROCESSABLE_ENTITY;
        if (error.details[0].type === 'any.required') {
            statusCode = BAD_REQUEST;
        }
        throw new ValidationError(error.message, statusCode);
    }
    return value;
}
