import { Request, Response, NextFunction } from 'express';
import { UniqueIndexErrorHandler } from '../utility/_validation/database';
import OperationalError from '../utility/_error/OperationalError';

/**
 * Handles a unique index error from the database.
 */
export function uniqueIndexError(error: any, req: Request, res: Response, next: NextFunction) {
    try {
        UniqueIndexErrorHandler.isDatabaseUniqueIndexError(error);
        next(error);
    } catch (error) {
        next(error);
    }
}

/**
 *  Handles general errors.
 * @returns {Response} ~ A response indicating the error.
 */
export function generalHandler(error: any, req: Request, res: Response, next: NextFunction) {
    if (error.statusCode) {
        return res.status(error.statusCode).json({
            error
        });
    }
    console.log(error);
    return res.status(500).json({
        error: new OperationalError()
    });
}
