import { Request, Response, NextFunction } from 'express';
import * as stickyServices from '../services/stickyNote';
import { sticyNoteValidationSchema } from '../utility/_validation/stickyNote';
import { ErrorCode, ErrorName, ErrorStatusCode, ValidationError } from '../utility/_error/ValidationError';

/**
 *  ~ Get a specific sticky note by its ID.
 *
 * @param {Request} req - Express Request object.
 * @param {Response} res - Express Response object.
 * @param {NextFunction} next - Express Next function.
 */
export async function getStickyNote(req: Request, res: Response, next: NextFunction) {
    try {
        const userId = res.locals.userId;
        const stickyNote = await stickyServices.get(req.params.id, userId);
        return res.status(200).json({ message: 'Sticky Note Found Successfully', stickyNote });
    } catch (error) {
        return next(error);
    }
}

/**
 *  ~ Get a paginated list of all sticky notes.
 *
 * @param {Request} req - Express Request object.
 * @param {Response} res - Express Response object.
 * @param {NextFunction} next - Express Next function.
 */
export async function getStickyNotes(req: Request, res: Response, next: NextFunction) {
    try {
        const userId = res.locals.userId;
        const page: string = req.query.page as string;
        const perPage: string = req.query.perPage as string;
        const stickyNotes = await stickyServices.getAll(+perPage, +page, userId);
        return res.status(200).json({ message: 'sticky Notes Found Successfully', stickyNotes });
    } catch (error) {
        return next(error);
    }
}

/**
 * ~ Create a new sticky note.
 *
 * @param {Request} req - Express Request object.
 * @param {Response} res - Express Response object.
 * @param {NextFunction} next - Express Next function.

 */
export async function postStickyNote(req: Request, res: Response, next: NextFunction) {
    try {
        const userId = res.locals.userId;
        const stickyBody = validate(req.body);
        stickyBody.userID = userId;
        await stickyServices.add(stickyBody);
        return res.status(200).json({ message: 'Sticky Note Added Successfully' });
    } catch (error) {
        return next(error);
    }
}

/**
 *  ~ Update an existing sticky note by its ID.
 *
 * @param {Request} req - Express Request object.
 * @param {Response} res - Express Response object.
 * @param {NextFunction} next - Express Next function.
 */
export async function patchStickyNote(req: Request, res: Response, next: NextFunction) {
    try {
        const userId = res.locals.userId;
        const stickyId = req.params.id;
        const stickyBody = validate(req.body);
        const modifiedCount: number = await stickyServices.update(stickyId, stickyBody, userId);
        return res.status(200).json({ message: 'Sticky Note Updated Successfully', modifiedCount });
    } catch (error) {
        return next(error);
    }
}

/**
 *  ~ Delete a sticky note by its ID.
 *
 * @param {Request} req - Express Request object.
 * @param {Response} res - Express Response object.
 * @param {NextFunction} next - Express Next function.
 */
export async function deleteStickyNote(req: Request, res: Response, next: NextFunction) {
    try {
        const userId = res.locals.userId;
        const stickyId = req.params.id;
        const deletedCount: number = await stickyServices.remove(stickyId, userId);
        return res.status(200).json({ message: 'Sticky Note Deleted Successfully', deletedCount });
    } catch (error) {
        return next(error);
    }
}

// helpers
function validate(body: any) {
    const { error, value } = sticyNoteValidationSchema.validate(body);
    if (error) {
        let statusCode = ErrorStatusCode.UNPROCESSABLE_ENTITY;
        if (error.details[0].type === 'any.required') {
            statusCode = ErrorStatusCode.BAD_REQUEST;
        }
        throw new ValidationError(
            error.message,
            ErrorCode.STICKY_DATA_VALIDATION_ERROR,
            ErrorName.STICKY_DATA_VALIDATION_ERROR,
            statusCode
        );
    }
    return value;
}
