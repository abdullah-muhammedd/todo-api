import { Request, Response, NextFunction } from 'express';
import TagServices from '../services/tag';
import { tagValidationSchema } from '../utility/_validation/tag';
import ValidationError from '../utility/_error/ValidationError';
import {
    BAD_REQUEST,
    UNPROCESSABLE_ENTITY
} from '../utility/_types/statusCodes';

/**
 *  Get a specific tag by its ID
 */
export async function getTag(req: Request, res: Response, next: NextFunction) {
    try {
        const userId = res.locals.userId;
        const tag = await TagServices.get(req.params.id, userId);
        return res
            .status(200)
            .json({ message: 'Tags Found Successfully', tag });
    } catch (error) {
        return next(error);
    }
}

/**
 *  Get a paginated list of all tags.
 */
export async function getTags(req: Request, res: Response, next: NextFunction) {
    try {
        const userId = res.locals.userId;
        const page: string = (req.query.page as string) ?? '1';
        const perPage: string = (req.query.perPage as string) ?? '3';
        const tags = await TagServices.getAll(+perPage, +page, userId);
        return res
            .status(200)
            .json({ message: 'Tags Found Successfully', tags });
    } catch (error) {
        return next(error);
    }
}

/**
 * Create a new tag.
 */
export async function postTag(req: Request, res: Response, next: NextFunction) {
    try {
        const userId = res.locals.userId;
        const tagBody = validate(req.body);
        tagBody.userID = userId;
        await TagServices.add(tagBody);
        return res.status(200).json({ message: 'Tag Added Successfully' });
    } catch (error) {
        return next(error);
    }
}

/**
 *  Update an existing tag by its ID.
 */
export async function patchTag(
    req: Request,
    res: Response,
    next: NextFunction
) {
    try {
        const userId = res.locals.userId;
        const tagId = req.params.id;
        const tagBody = validate(req.body);
        const modifiedCount: number = await TagServices.update(
            tagId,
            tagBody,
            userId
        );
        return res
            .status(200)
            .json({ message: 'tag Updated Successfully', modifiedCount });
    } catch (error) {
        return next(error);
    }
}

/**
 *  Delete a tag by its ID.
 */
export async function deleteTag(
    req: Request,
    res: Response,
    next: NextFunction
) {
    try {
        const userId = res.locals.userId;
        const tagId = req.params.id;
        const deletedCount: number = await TagServices.remove(tagId, userId);
        return res
            .status(200)
            .json({ message: 'tag Deleted Successfully', deletedCount });
    } catch (error) {
        return next(error);
    }
}
export async function countTags(
    req: Request,
    res: Response,
    next: NextFunction
) {
    try {
        const userID = res.locals.userId;
        const count = await TagServices.count(userID);
        return res
            .status(200)
            .json({ message: 'Operation Processed Successfully', count });
    } catch (error) {
        return next(error);
    }
}
// helpers
function validate(body: any) {
    const { error, value } = tagValidationSchema.validate(body);
    if (error) {
        let statusCode = UNPROCESSABLE_ENTITY;
        if (error.details[0].type === 'any.required') {
            statusCode = BAD_REQUEST;
        }
        throw new ValidationError(error.message, statusCode);
    }
    return value;
}
