import { Request, Response, NextFunction } from 'express';
import * as listServices from '../services/list';
import { listValidationSchema } from '../utility/_validation/list';
import { ErrorCode, ErrorName, ErrorStatusCode, ValidationError } from '../utility/_error/ValidationError';

/**
 *  ~ Get a specific list by its ID.
 *
 * @param {Request} req - Express Request object.
 * @param {Response} res - Express Response object.
 * @param {NextFunction} next - Express Next function.
 */
export async function getList(req: Request, res: Response, next: NextFunction) {
    try {
        const userId = res.locals.userId;
        const list = await listServices.get(req.params.id, userId);
        return res.status(200).json({ message: 'List Found Successfully', list });
    } catch (error) {
        return next(error);
    }
}

/**
 *  ~ Get a paginated list of all lists.
 *
 * @param {Request} req - Express Request object.
 * @param {Response} res - Express Response object.
 * @param {NextFunction} next - Express Next function.
 */
export async function getLists(req: Request, res: Response, next: NextFunction) {
    try {
        const userId = res.locals.userId;
        const page: string = req.query.page as string;
        const perPage: string = req.query.perPage as string; // Corrected variable name
        const lists = await listServices.getAll(+perPage, +page, userId);
        return res.status(200).json({ message: 'Lists Found Successfully', lists });
    } catch (error) {
        return next(error);
    }
}

/**
 * ~ Create a new list.
 *
 * @param {Request} req - Express Request object.
 * @param {Response} res - Express Response object.
 * @param {NextFunction} next - Express Next function.

 */
export async function postList(req: Request, res: Response, next: NextFunction) {
    try {
        const userId = res.locals.userId;
        const listBody = validate(req.body);
        listBody.userID = userId;
        await listServices.add(listBody);
        return res.status(200).json({ message: 'List Added Successfully' });
    } catch (error) {
        return next(error);
    }
}

/**
 *  ~ Update an existing list by its ID.
 *
 * @param {Request} req - Express Request object.
 * @param {Response} res - Express Response object.
 * @param {NextFunction} next - Express Next function.
 */
export async function patchList(req: Request, res: Response, next: NextFunction) {
    try {
        const userId = res.locals.userId;
        const listId = req.params.id;
        const listBody = validate(req.body);
        const modifiedCount: number = await listServices.update(listId, listBody, userId);
        return res.status(200).json({ message: 'List Updated Successfully', modifiedCount });
    } catch (error) {
        return next(error);
    }
}

/**
 *  ~ Delete a list by its ID.
 *
 * @param {Request} req - Express Request object.
 * @param {Response} res - Express Response object.
 * @param {NextFunction} next - Express Next function.
 */
export async function deleteList(req: Request, res: Response, next: NextFunction) {
    try {
        const userId = res.locals.userId;
        const listId = req.params.id;
        const deletedCount: number = await listServices.remove(listId, userId);
        return res.status(200).json({ message: 'List Deleted Successfully', deletedCount });
    } catch (error) {
        return next(error);
    }
}

// helpers
function validate(body: any) {
    const { error, value } = listValidationSchema.validate(body);
    if (error) {
        let statusCode = ErrorStatusCode.UNPROCESSABLE_ENTITY;
        if (error.details[0].type === 'any.required') {
            statusCode = ErrorStatusCode.BAD_REQUEST;
        }
        throw new ValidationError(
            error.message,
            ErrorCode.LIST_DATA_VALIDATION_ERROR,
            ErrorName.LIST_DATA_VALIDATION_ERROR,
            statusCode
        );
    }
    return value;
}
