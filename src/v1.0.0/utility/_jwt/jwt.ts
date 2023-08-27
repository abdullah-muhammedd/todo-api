import * as jwt from 'jsonwebtoken';
/**
 *  ~ Generates a new access token for a user with the specified user ID.
 *
 * @param {string} userId - The unique identifier of the user for whom the access token is generated.
 * @returns {string} The newly generated access token.
 */
export function generateAccessToken(userId: string): string {
    const accessToken = jwt.sign({ userId }, <string>process.env.ACCESS_TOKEN_SECRET, {
        algorithm: 'HS256',
        expiresIn: process.env.ACCESS_TOKEN_LIFE
    });
    return accessToken;
}

/**
 * ~ Generates a new refresh token for a user with the specified user ID.
 *
 * @param {string} userId - The unique identifier of the user for whom the refresh token is generated.
 * @returns {string} ~ The newly generated refresh token.
 */
export function generateRefreshToken(userId: string): string {
    const refreshToken = jwt.sign({ userId }, <string>process.env.REFRESH_TOKEN_SECRET, {
        algorithm: 'HS256',
        expiresIn: process.env.REFRESH_TOKEN_LIFE
    });
    return refreshToken;
}

/**
 * ~ Verifies an access token and returns the payload if valid.
 *
 * @param {string} token - The access token to verify.
 * @returns {string | jwt.JwtPayload | null} ~ The payload of the valid access token.
 */
export function verifyAccessToken(token: string): jwt.JwtPayload | string {
    const payload = jwt.verify(token, <string>process.env.ACCESS_TOKEN_SECRET);
    return payload;
}

/**
 * ~ Verifies a refresh token and returns the payload if valid.
 *
 * @param {string} token - The refresh token to verify.
 * @returns {jwt.JwtPayload | string | null} ~ The payload of the valid refresh token.
 */
export function verifyRefreshToken(token: string): jwt.JwtPayload | string {
    const payload = jwt.verify(token, <string>process.env.REFRESH_TOKEN_SECRET);
    return payload;
}
/**
 * ~ Renews an access token using a refresh token and returns the renewed access token along with the user ID.
 *
 * @param {string} refreshToken - The refresh token to use for renewing the access token.
 * @returns {{ token: string; userId: string }} ~ An object containing the renewed access token and the user ID.
 */
export function renewAccessToken(refreshToken: string): { token: string; userId: string } | never {
    const payload = verifyRefreshToken(refreshToken) as jwt.JwtPayload;
    return {
        token: generateAccessToken(payload.userId),
        userId: payload.userId
    };
}
