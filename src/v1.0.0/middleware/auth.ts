import { Request, Response, NextFunction } from 'express';
import AuthError from '../utility/_error/AuthError';
import { UNAUTHORIZED, FORBIDDEN } from '../utility/_types/statusCodes';
import * as jwt from '../utility/_jwt/jwt';

/**
 * Middleware to authenticate the user using an access token.
 * If the token is valid, the user's ID is stored in res.locals.userId.
 * If the token is expired, it is renewed using the provided refresh token.
 * If the refresh token is also expired, an error is thrown.
 */
export function isAuthenticated(
    req: Request,
    res: Response,
    next: NextFunction
): void {
    try {
        const accessToken = req.signedCookies.access_token?.split(' ')[1];

        if (!accessToken) {
            throw new AuthError('User Is Not Logged In', UNAUTHORIZED);
        }

        const payload: any = jwt.verifyAccessToken(accessToken as string);
        res.locals.userId = payload.userId;

        return next();
    } catch (error: any) {
        if (error.name === 'TokenExpiredError') {
            handleAccessTokenExpiry(req, res, next);
        } else {
            throw new AuthError('User Is Not Logged In', UNAUTHORIZED);
        }
    }
}

/**
 * Handles the expiry of the access token by renewing it using the provided refresh token.
 * If the refresh token is also expired or corrupted, it throws an AuthError.
 *
 * @throws {AuthError} Throws an AuthError if the refresh token is also expired.
 */
function handleAccessTokenExpiry(
    req: Request,
    res: Response,
    next: NextFunction
) {
    try {
        const refreshToken = req.signedCookies.refresh_token?.split(' ')[1];

        if (!refreshToken) {
            throw new AuthError('User Is Not Logged In', UNAUTHORIZED);
        }

        const { token, userId } = jwt.renewAccessToken(refreshToken);
        res.cookie('access_token', `Bearer ${token}`, {
            httpOnly: true,
            maxAge: 24 * 60 * 60 * 1000,
            signed: true
        });
        res.locals.userId = userId;

        return next();
    } catch (error: any) {
        if (error.name === 'TokenExpiredError') {
            throw new AuthError('User Is Not Logged In', UNAUTHORIZED);
        } else {
            throw error;
        }
    }
}

/**
 * Middleware to check if the user is not authenticated (i.e., access token is not present).
 *
 * @throws {AuthError} Throws an AuthError with a client-friendly message if an access token is present.
 */
export function isNotAuthenticated(
    req: Request,
    _res: Response,
    next: NextFunction
): void {
    const accessToken = req.signedCookies.access_token?.split(' ')[1];

    if (accessToken) {
        throw new AuthError('Access Denied', FORBIDDEN);
    }

    return next();
}
