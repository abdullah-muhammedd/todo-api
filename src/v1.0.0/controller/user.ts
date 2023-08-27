import { Request, Response, NextFunction } from 'express';
import * as userServices from '../services/user';
import * as userValidation from '../utility/_validation/user';
import * as passwordEncryption from '../utility/_encryption/password';
import { ErrorCode, ErrorName, ErrorStatusCode, ValidationError } from '../utility/_error/ValidationError';

/**
 * ~ Retrieves a user's information.
 *
 * @param {Request} req - The Express request object.
 * @param {Response} res - The Express response object.
 * @param {NextFunction} next - The next middleware function.
 * @returns {Promise<Response | void>} ~ A response containing the user's information or an error response.
 */
export async function getUser(req: Request, res: Response, next: NextFunction): Promise<Response | void> {
    try {
        const id = res.locals.userId;
        const user = await userServices.find(id);
        return res.status(200).json({
            message: 'User Found Successfully',
            user
        });
    } catch (error) {
        next(error);
    }
}

/**
 * ~ Updates a user's data.
 *
 * @param {Request} req - The Express request object.
 * @param {Response} res - The Express response object.
 * @param {NextFunction} next - The next middleware function.
 * @returns {Promise<Response | void>} ~ A response indicating the success of the update or an error response.
 * @throws {ValidationError} ~ Throws a `ValidationError` if the provided user data is invalid.
 */
export async function patchUserData(req: Request, res: Response, next: NextFunction): Promise<Response | void> {
    try {
        const body = req.body;
        const { error, value } = userValidation.updatingUserSchema.validate(body);
        if (error) {
            let statusCode = ErrorStatusCode.UNPROCESSABLE_ENTITY;
            if (error.details[0].type === 'any.required') {
                statusCode = ErrorStatusCode.BAD_REQUEST;
            }
            throw new ValidationError(
                error.message,
                ErrorCode.USER_DATA_VALIDATION_ERROR,
                ErrorName.USER_DATA_VALIDATION_ERROR,
                statusCode
            );
        }

        const id = res.locals.userId;
        const modifiedCount = await userServices.update(id, value);
        return res.status(200).json({
            message: 'User Updated Successfully',
            modifiedUsers: modifiedCount
        });
    } catch (error) {}
}

/**
 * ~ Updates a user's password.
 *
 * @param {Request} req - The Express request object.
 * @param {Response} res - The Express response object.
 * @param {NextFunction} next - The next middleware function.
 * @returns {Promise<Response | void>} ~ A response indicating the success of the password update or an error response.
 * @throws {ValidationError} ~ Throws a `ValidationError` if the provided password is invalid.
 */
export async function patchUserPassword(req: Request, res: Response, next: NextFunction): Promise<Response | void> {
    try {
        const body = req.body;
        const { error, value } = userValidation.updatingPasswordSchema.validate(body);
        if (error) {
            let statusCode = ErrorStatusCode.UNPROCESSABLE_ENTITY;
            if (error.details[0].type === 'any.required') {
                statusCode = ErrorStatusCode.BAD_REQUEST;
            }
            throw new ValidationError(
                error.message,
                ErrorCode.USER_DATA_VALIDATION_ERROR,
                ErrorName.USER_DATA_VALIDATION_ERROR,
                statusCode
            );
        }

        const password = body.password;
        const hashedPassword = await passwordEncryption.getEncryptedPassword(password);
        body.password = hashedPassword;

        const id = res.locals.userId;
        const modifiedCount = await userServices.update(id, value);

        return res.status(200).json({
            message: 'User Updated Successfully',
            modifiedUsers: modifiedCount
        });
    } catch (error) {}
}
