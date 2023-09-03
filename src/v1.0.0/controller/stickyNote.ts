import { Request, Response, NextFunction } from 'express';
import StickyServices from '../services/stickyNote';
import { sticyNoteValidationSchema } from '../utility/_validation/stickyNote';
import ValidationError from '../utility/_error/ValidationError';
import { BAD_REQUEST, UNPROCESSABLE_ENTITY } from '../utility/_types/statusCodes';

/**
 *  Get a specific sticky note by its ID.
 */
export async function getStickyNote(req: Request, res: Response, next: NextFunction) {
    try {
        const userId = res.locals.userId;
        const stickyNote = await StickyServices.get(req.params.id, userId);
        return res.status(200).json({ message: 'Sticky Note Found Successfully', stickyNote });
    } catch (error) {
        return next(error);
    }
}

/**
 *  Get a paginated list of all sticky notes.
 */
export async function getStickyNotes(req: Request, res: Response, next: NextFunction) {
    try {
        const userId = res.locals.userId;
        const page: string = req.query.page as string;
        const perPage: string = req.query.perPage as string;
        const stickyNotes = await StickyServices.getAll(+perPage, +page, userId);
        return res.status(200).json({ message: 'sticky Notes Found Successfully', stickyNotes });
    } catch (error) {
        return next(error);
    }
}

/**
 *  Create a new sticky note.
 */
export async function postStickyNote(req: Request, res: Response, next: NextFunction) {
    try {
        const userId = res.locals.userId;
        const stickyBody = validate(req.body);
        stickyBody.userID = userId;
        await StickyServices.add(stickyBody);
        return res.status(200).json({ message: 'Sticky Note Added Successfully' });
    } catch (error) {
        return next(error);
    }
}

/**
 *  Update an existing sticky note by its ID.
 */
export async function patchStickyNote(req: Request, res: Response, next: NextFunction) {
    try {
        const userId = res.locals.userId;
        const stickyId = req.params.id;
        const stickyBody = validate(req.body);
        const modifiedCount: number = await StickyServices.update(stickyId, stickyBody, userId);
        return res.status(200).json({ message: 'Sticky Note Updated Successfully', modifiedCount });
    } catch (error) {
        return next(error);
    }
}

/**
 *  Delete a sticky note by its ID.
 */
export async function deleteStickyNote(req: Request, res: Response, next: NextFunction) {
    try {
        const userId = res.locals.userId;
        const stickyId = req.params.id;
        const deletedCount: number = await StickyServices.remove(stickyId, userId);
        return res.status(200).json({ message: 'Sticky Note Deleted Successfully', deletedCount });
    } catch (error) {
        return next(error);
    }
}

// helpers
function validate(body: any) {
    const { error, value } = sticyNoteValidationSchema.validate(body);
    if (error) {
        let statusCode = UNPROCESSABLE_ENTITY;
        if (error.details[0].type === 'any.required') {
            statusCode = BAD_REQUEST;
        }
        throw new ValidationError(error.message, statusCode);
    }
    return value;
}
