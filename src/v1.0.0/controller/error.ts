import { Request, Response, NextFunction } from 'express';
import { UniqueIndexErrorHandler } from '../utility/_validation/database';
import OperationalError from '../utility/_error/OperationalError';
import logger from '../utility/_logger/logger ';

/**
 * Handles a unique index error from the database.
 */
export function uniqueIndexError(
    error: any,
    req: Request,
    res: Response,
    next: NextFunction
) {
    try {
        UniqueIndexErrorHandler.isDatabaseUniqueIndexError(error);
        next(error);
    } catch (error) {
        next(error);
    }
}

/**
 *  Handles general errors.
 */
export function generalHandler(
    error: any,
    req: Request,
    res: Response,
    next: NextFunction
) {
    if (error.statusCode) {
        return res.status(error.statusCode).json({
            error
        });
    }
    logger.error(error);
    return res.status(500).json({
        error: new OperationalError()
    });
}
// Handle 404 endpoint not found error
export function notFoundHandler(
    req: Request,
    res: Response,
    next: NextFunction
) {
    res.status(404).json({ error: 'Not Found' });
}
