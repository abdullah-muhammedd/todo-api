import { Request, Response, NextFunction } from 'express';
import { AuthError, ErrorName, ErrorCode, ErrorStatusCode } from '../utility/_error/AuthError';
import * as jwt from '../utility/_jwt/jwt';

/**
 *  ~ Middleware to authenticate the user using an access token.
 *  ~ If the token is valid, the user's ID is stored in res.locals.userId.
 *  ~ If the token is expired, it is renewed using the provided refresh token.
 *  ~ If the refresh token is also expired, an error is thrown.
 *
 * @param req - Express Request object
 * @param res - Express Response object
 * @param next - Express Next function
 */
export function isAuthenticated(req: Request, res: Response, next: NextFunction): void {
    try {
        // Attempt to get the access token from the request headers.
        const accessToken = req.get('Authorization')?.split(' ')[1];

        // If no access token is provided, the user is not logged in.
        if (!accessToken) {
            throw new AuthError(
                'User Is Not Logged In',
                ErrorCode.ACCESS_TOKEN_VALIDATION_ERROR,
                ErrorName.ACCESS_TOKEN_VALIDATION_ERROR,
                ErrorStatusCode.UNAUTHORIZED
            );
        }
        // Verify and decode the access token to extract user information.
        const payload: any = jwt.verifyAccessToken(<string>accessToken);

        // Set the user ID in the response locals for future use.
        res.locals.userId = payload.userId;

        // Proceed to the next middleware.
        return next();
    } catch (error: any) {
        if (error.name === 'TokenExpiredError') {
            // If the access token has expired, handle it.
            handleAccessTokenExpiry(req, res, next);
        } else {
            // For other errors, indicate that the user is not logged in.
            throw new AuthError(
                'User Is Not Logged In',
                ErrorCode.ACCESS_TOKEN_VALIDATION_ERROR,
                ErrorName.ACCESS_TOKEN_VALIDATION_ERROR,
                ErrorStatusCode.UNAUTHORIZED
            );
        }
    }
}

/**
 *  ~ Handles the expiry of the access token by renewing it using the provided refresh token.
 *  ~ If the refresh token is also expired or corrupted, it throws an AuthError.
 *
 * @param {Request} req - Express Request object
 * @param {Response} res - Express Response object
 * @param {NextFunction} next - Express Next function
 * @throws {AuthError} Throws an AuthError if the refresh token is also expired.
 */
function handleAccessTokenExpiry(req: Request, res: Response, next: NextFunction) {
    try {
        //  Attempt to get the refresh token from the request headers.
        const refreshToken = req.get('X-Refresh-Token')?.split(' ')[1];
        //  If no refresh token is provided, the user is not logged in.
        if (!refreshToken) {
            throw new AuthError(
                'User Is Not Logged In',
                ErrorCode.REFRESH_TOKEN_VALIDATION_ERROR,
                ErrorName.REFRESH_TOKEN_VALIDATION_ERROR,
                ErrorStatusCode.UNAUTHORIZED
            );
        }

        //  Renew the access token using the refresh token.
        const { token, userId } = jwt.renewAccessToken(refreshToken);

        //  Set the new access token in the response headers.
        res.setHeader('Authorization', `Bearer ${token}`);

        //  Set the user ID in the response locals for future use and peoceed to the next middleware
        res.locals.userId = userId;
        return next();
    } catch (error: any) {
        if (error.name === 'TokenExpiredError') {
            //  If the refresh token has also expired, indicate that the user is not logged in.
            throw new AuthError(
                'User Is Not Logged In',
                ErrorCode.REFRESH_TOKEN_VALIDATION_ERROR,
                ErrorName.REFRESH_TOKEN_VALIDATION_ERROR,
                ErrorStatusCode.UNAUTHORIZED
            );
        } else {
            // For other errors, indicate that the user is not logged in.
            throw error;
        }
    }
}
/**
 *  ~ Middleware to check if the user is not authenticated (i.e., access token is not present).
 *
 * @param {Request} req - The Express Request object.
 * @param {Response} _res - The Express Response object (not used in this middleware).
 * @param {NextFunction} next - The next middleware function.
 *
 * @throws {AuthError} Throws an AuthError with a client-friendly message if an access token is present.
 */
export function isNotAuthenticated(req: Request, _res: Response, next: NextFunction): void {
    //  Attempt to get the access token from the request headers.
    const accessToken = req.get('Authorization')?.split(' ')[1];

    //  If an access token is present, it indicates the user is already authenticated.
    if (accessToken) {
        throw new AuthError(
            'Access Denied',
            ErrorCode.ACCESS_TOKEN_VALIDATION_ERROR,
            ErrorName.ACCESS_TOKEN_VALIDATION_ERROR,
            ErrorStatusCode.FORBIDDEN
        );
    }

    //  If no access token is present, proceed to the next middleware.
    return next();
}
