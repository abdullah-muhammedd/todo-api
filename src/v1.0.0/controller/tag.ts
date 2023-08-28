import { Request, Response, NextFunction } from 'express';
import * as tagServices from '../services/tag';
import { tagValidationSchema } from '../utility/_validation/tag';
import { ErrorCode, ErrorName, ErrorStatusCode, ValidationError } from '../utility/_error/ValidationError';

/**
 *  ~ Get a specific tag by its ID.
 *
 * @param {Request} req - Express Request object.
 * @param {Response} res - Express Response object.
 * @param {NextFunction} next - Express Next function.
 */
export async function getTag(req: Request, res: Response, next: NextFunction) {
    try {
        const userId = res.locals.userId;
        const tag = await tagServices.get(req.params.id, userId);
        return res.status(200).json({ message: 'Tags Found Successfully', tag });
    } catch (error) {
        return next(error);
    }
}

/**
 *  ~ Get a paginated tag of all tags.
 *
 * @param {Request} req - Express Request object.
 * @param {Response} res - Express Response object.
 * @param {NextFunction} next - Express Next function.
 */
export async function getTags(req: Request, res: Response, next: NextFunction) {
    try {
        const userId = res.locals.userId;
        const page: string = req.query.page as string;
        const perPage: string = req.query.perPage as string; // Corrected variable name
        const tags = await tagServices.getAll(+perPage, +page, userId);
        return res.status(200).json({ message: 'Tags Found Successfully', tags });
    } catch (error) {
        return next(error);
    }
}

/**
 * ~ Create a new tag.
 *
 * @param {Request} req - Express Request object.
 * @param {Response} res - Express Response object.
 * @param {NextFunction} next - Express Next function.

 */
export async function postTag(req: Request, res: Response, next: NextFunction) {
    try {
        const userId = res.locals.userId;
        const { error, value } = tagValidationSchema.validate(req.body);
        if (error) {
            let statusCode = ErrorStatusCode.UNPROCESSABLE_ENTITY;
            if (error.details[0].type === 'any.required') {
                statusCode = ErrorStatusCode.BAD_REQUEST;
            }
            throw new ValidationError(
                error.message,
                ErrorCode.TAG_DATA_VALIDATION_ERROR,
                ErrorName.TAG_DATA_VALIDATION_ERROR,
                statusCode
            );
        }
        const tagBody = value;
        tagBody.userID = userId;
        await tagServices.add(tagBody);
        return res.status(200).json({ message: 'Tag Added Successfully' });
    } catch (error) {
        return next(error);
    }
}

/**
 *  ~ Update an existing tag by its ID.
 *
 * @param {Request} req - Express Request object.
 * @param {Response} res - Express Response object.
 * @param {NextFunction} next - Express Next function.
 */
export async function patchTag(req: Request, res: Response, next: NextFunction) {
    try {
        const userId = res.locals.userId;
        const tagId = req.params.id;
        const { error, value } = tagValidationSchema.validate(req.body);
        if (error) {
            let statusCode = ErrorStatusCode.UNPROCESSABLE_ENTITY;
            if (error.details[0].type === 'any.required') {
                statusCode = ErrorStatusCode.BAD_REQUEST;
            }
            throw new ValidationError(
                error.message,
                ErrorCode.TAG_DATA_VALIDATION_ERROR,
                ErrorName.TAG_DATA_VALIDATION_ERROR,
                statusCode
            );
        }
        const tagBody = value;
        const modifiedCount: number = await tagServices.update(tagId, tagBody, userId);
        return res.status(200).json({ message: 'tag Updated Successfully', modifiedCount });
    } catch (error) {
        return next(error);
    }
}

/**
 *  ~ Delete a tag by its ID.
 *
 * @param {Request} req - Express Request object.
 * @param {Response} res - Express Response object.
 * @param {NextFunction} next - Express Next function.
 */
export async function deletetag(req: Request, res: Response, next: NextFunction) {
    try {
        const userId = res.locals.userId;
        const tagId = req.params.id;
        const deletedCount: number = await tagServices.remove(tagId, userId);
        return res.status(200).json({ message: 'tag Deleted Successfully', deletedCount });
    } catch (error) {
        return next(error);
    }
}
