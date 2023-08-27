import { Request, Response, NextFunction } from 'express';
import { ErrorCode, ErrorName } from '../utility/_error/ValidationError';
import * as databaseValidation from '../utility/_validation/database';
import OperationalError from '../utility/_error/OperationalError';

// Constansts Used For Validation Erro Handling
const ERROR_CODE = ErrorCode.UNIQUE_INDEX_VALIDATION_ERROR;
const ERROR_NAME = ErrorName.UNIQUE_INDEX_VALIDATION_ERROR;

/**
 * ~ Handles a unique index error from the database.
 *
 * @param {Error} error - The error object.
 * @param {Request} req - The Express request object.
 * @param {Response} res - The Express response object.
 * @param {NextFunction} next - The next middleware function.
 */
export function uniqueIndexError(error: any, req: Request, res: Response, next: NextFunction) {
    try {
        databaseValidation.isDatabaseUniqueIndexError(error, ERROR_CODE, ERROR_NAME);
        next(error);
    } catch (error) {
        next(error);
    }
}

/**
 * ~ Handles general errors.
 *
 * @param {Error} error - The error object.
 * @param {Request} req - The Express request object.
 * @param {Response} res - The Express response object.
 * @param {NextFunction} next - The next middleware function.
 * @returns {Response} ~ A response indicating the error.
 */
export function generalHandler(error: any, req: Request, res: Response, next: NextFunction) {
    if (error.statusCode) {
        return res.status(error.statusCode).json({
            error
        });
    }
    return res.status(500).json({
        error: new OperationalError()
    });
}
