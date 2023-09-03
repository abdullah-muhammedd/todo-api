import { Request, Response, NextFunction } from 'express';
import UserServices from '../services/user';
import * as userValidation from '../utility/_validation/user';
import * as passwordEncryption from '../utility/_encryption/password';
import ValidationError from '../utility/_error/ValidationError';
import { BAD_REQUEST, UNPROCESSABLE_ENTITY } from '../utility/_types/statusCodes';

/**
 *  Retrieves a user's information.
 */
export async function getUser(req: Request, res: Response, next: NextFunction): Promise<Response | void> {
    try {
        const id = res.locals.userId;
        const user = await UserServices.find(id);
        return res.status(200).json({
            message: 'User Found Successfully',
            user
        });
    } catch (error) {
        next(error);
    }
}

/**
 *  Updates a user's data.
 */
export async function patchUserData(req: Request, res: Response, next: NextFunction): Promise<Response | void> {
    try {
        const body = req.body;
        const { error, value } = userValidation.updatingUserSchema.validate(body);
        if (error) {
            let statusCode = UNPROCESSABLE_ENTITY;
            if (error.details[0].type === 'any.required') {
                statusCode = BAD_REQUEST;
            }
            throw new ValidationError(error.message, statusCode);
        }

        const id = res.locals.userId;
        const modifiedCount = await UserServices.update(id, value);
        return res.status(200).json({
            message: 'User Updated Successfully',
            modifiedUsers: modifiedCount
        });
    } catch (error) {}
}

/**
 *  Updates a user's password.
 */
export async function patchUserPassword(req: Request, res: Response, next: NextFunction): Promise<Response | void> {
    try {
        const body = req.body;
        const { error, value } = userValidation.updatingPasswordSchema.validate(body);
        if (error) {
            let statusCode = UNPROCESSABLE_ENTITY;
            if (error.details[0].type === 'any.required') {
                statusCode = BAD_REQUEST;
            }
            throw new ValidationError(error.message, statusCode);
        }

        const password = body.password;
        const hashedPassword = await passwordEncryption.getEncryptedPassword(password);
        value.password = hashedPassword;

        const id = res.locals.userId;
        const modifiedCount = await UserServices.update(id, value);

        return res.status(200).json({
            message: 'User Updated Successfully',
            modifiedUsers: modifiedCount
        });
    } catch (error) {}
}
