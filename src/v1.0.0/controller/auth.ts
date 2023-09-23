import { Request, Response, NextFunction } from 'express';
import UserServices from '../services/user';
import ValidationError from '../utility/_error/ValidationError';
import * as userValidation from '../utility/_validation/user';
import * as jwt from '../utility/_jwt/jwt';
import * as passwordEncryption from '../utility/_encryption/password';
import {
    BAD_REQUEST,
    UNPROCESSABLE_ENTITY,
    UNAUTHORIZED
} from '../utility/_types/statusCodes';

/**
 * Handles the sign-up process for a user.
 *
 * @returns {Promise<Response | void>} ~ A response indicating the success of the sign-up process or an error response.
 * @throws {ValidationError} ~ Throws a `ValidationError` if the provided user data is invalid.
 */
export async function postSignUp(
    req: Request,
    res: Response,
    next: NextFunction
): Promise<Response | void> {
    try {
        // Extract the request body.
        const body = req.body;

        // Validate the user data using a predefined schema.
        const { error, value } = userValidation.addingUserSchema.validate(body);

        // If validation fails, handle it.
        if (error) {
            let statusCode = UNPROCESSABLE_ENTITY;
            if (error.details[0].type === 'any.required') {
                statusCode = BAD_REQUEST;
            }
            throw new ValidationError(error.message, statusCode);
        }

        // Extract the password from the body.
        const password = value.password;

        // Hash the password using a suitable encryption method.
        const hashedPassword =
            await passwordEncryption.getEncryptedPassword(password);
        value.password = hashedPassword;

        // Add the user to the database.
        await UserServices.add(value);

        // Send a success response.
        return res.status(200).json({ message: 'User Signed Up Successfully' });
    } catch (error) {
        next(error);
    }
}

/**
 * Handles the login process for a user.
 *
 * @returns {Promise<Response | void>} ~ A response indicating the success of the login process or an error response.
 * @throws {ValidationError} ~ Throws a `ValidationError` if the provided user data is invalid.
 * @throws {ValidationError} ~ Throws a `ValidationError` if the password is incorrect.
 */
export async function postLogin(
    req: Request,
    res: Response,
    next: NextFunction
): Promise<Response | void> {
    try {
        // Extract the request body.
        const body = req.body;

        // Validate the user data using a predefined schema.
        const { error, value } =
            userValidation.checkingUserSchema.validate(body);

        // If validation fails, handle it.
        if (error) {
            let statusCode = UNPROCESSABLE_ENTITY;
            if (error.details[0].type === 'any.required') {
                statusCode = BAD_REQUEST;
            }
            throw new ValidationError(error.message, statusCode);
        }

        let user: any;

        // Determine if the input is an email or a username.
        if (
            value.emailOrUserName
                .split('')
                .find((ele: string) => ele === '@') !== undefined
        ) {
            // Search for the user by email.
            user = await UserServices.findWithEmail(value.emailOrUserName);
        } else {
            // Search for the user by username.
            user = await UserServices.findWithUserName(value.emailOrUserName);
        }

        // Validate the provided password against the hashed password in the database.
        const matched = await passwordEncryption.validatePassword(
            value.password,
            user.password
        );

        // If the password is incorrect, throw an error.
        if (!matched) {
            throw new ValidationError('Password Is Wrong', UNAUTHORIZED);
        }
        // Generate a new access token and refresh token.
        const accessToken = jwt.generateAccessToken(user._id);
        const refreshToken = jwt.generateRefreshToken(user._id);

        // send tokens with httpOnly cookies
        res.cookie('access_token', `Bearer ${accessToken}`, {
            httpOnly: true,
            maxAge: 24 * 60 * 60 * 1000,
            signed: true,
            sameSite: 'none',
            secure: true
        });
        res.cookie('refresh_token', `Bearer ${refreshToken}`, {
            httpOnly: true,
            maxAge: 30 * 24 * 60 * 60 * 1000,
            signed: true,
            sameSite: 'none',
            secure: true
        });
        res.cookie('tokens_existed', 'true', {
            maxAge: 30 * 24 * 60 * 60 * 1000,
            sameSite: 'none'
        });
        // Send a success response.
        return res.status(200).json({
            message: 'User Authenticated Successfully'
        });
    } catch (error) {
        next(error);
    }
}

export async function getLogout(
    req: Request,
    res: Response,
    next: NextFunction
) {
    // Clear the access_token and refresh_token cookies
    res.clearCookie('access_token');
    res.clearCookie('refresh_token');
    res.cookie('tokens_existed', 'false', {
        maxAge: 30 * 24 * 60 * 60 * 1000,
        sameSite: 'none'
    });
    // Send a response to confirm that cookies are cleared
    return res.status(200).json({
        message: 'User LoggedOut Successfully'
    });
}
