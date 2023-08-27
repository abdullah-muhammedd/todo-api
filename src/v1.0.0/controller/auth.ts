import { Request, Response, NextFunction } from 'express';
import * as userServices from '../services/user';
import { ValidationError, ErrorCode, ErrorName, ErrorStatusCode } from '../utility/_error/ValidationError';
import * as userValidation from '../utility/_validation/user';
import * as jwt from '../utility/_jwt/jwt';
import * as passwordEncryption from '../utility/_encryption/password';

/**
 * ~ Handles the sign-up process for a user.
 *
 * @param {Request} req - The Express request object.
 * @param {Response} res - The Express response object.
 * @param {NextFunction} next - The next middleware function.
 * @returns {Promise<Response | void>} ~ A response indicating the success of the sign-up process or an error response.
 * @throws {ValidationError} ~ Throws a `ValidationError` if the provided user data is invalid.
 */
export async function postSignUp(req: Request, res: Response, next: NextFunction): Promise<Response | void> {
    try {
        // Extract the request body.
        const body = req.body;

        // Validate the user data using a predefined schema.
        const { error, value } = userValidation.addingUserSchema.validate(body);

        // If validation fails, handle it.
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

        // Extract the password from the body.
        const password = value.password;

        // Hash the password using a suitable encryption method.
        const hashedPassword = await passwordEncryption.getEncryptedPassword(password);
        value.password = hashedPassword;

        // Add the user to the database.
        await userServices.add(value);

        // Send a success response.
        return res.status(200).json({ message: 'User Signed Up Successfully' });
    } catch (error) {
        next(error);
    }
}

/**
 * ~ Handles the login process for a user.
 *
 * @param {Request} req - The Express request object.
 * @param {Response} res - The Express response object.
 * @param {NextFunction} next - The next middleware function.
 * @returns {Promise<Response | void>} ~ A response indicating the success of the login process or an error response.
 * @throws {ValidationError} ~ Throws a `ValidationError` if the provided user data is invalid.
 * @throws {ValidationError} ~ Throws a `ValidationError` if the password is incorrect.
 */
export async function postLogin(req: Request, res: Response, next: NextFunction): Promise<Response | void> {
    try {
        // Extract the request body.
        const body = req.body;

        // Validate the user data using a predefined schema.
        const { error, value } = userValidation.checkingUserSchema.validate(body);

        // If validation fails, handle it.
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

        let user: any;

        // Determine if the input is an email or a username.
        if (value.emailOrUserName.split('').find((ele: string) => ele === '@') !== undefined) {
            // Search for the user by email.
            user = await userServices.findWithEmail(value.emailOrUserName);
        } else {
            // Search for the user by username.
            user = await userServices.findWithUserName(value.emailOrUserName);
        }

        // Validate the provided password against the hashed password in the database.
        const matched = await passwordEncryption.validatePassword(value.password, user.password);

        // If the password is incorrect, throw an error.
        if (!matched) {
            throw new ValidationError(
                'Password Is Wrong',
                ErrorCode.USER_DATA_VALIDATION_ERROR,
                ErrorName.USER_DATA_VALIDATION_ERROR,
                ErrorStatusCode.BAD_REQUEST
            );
        }
        // Generate a new access token and refresh token.
        const accessToken = jwt.generateAccessToken(user._id);
        const refreshToken = jwt.generateRefreshToken(user._id);

        // Set response headers with the new tokens.
        res.setHeader('Authorization', `Bearer ${accessToken}`);
        res.setHeader('X-Refresh-Token', `Bearer ${refreshToken}`);

        // Send a success response.
        return res.status(200).json({
            message: 'User Authenticated Successfully'
        });
    } catch (error) {
        next(error);
    }
}
