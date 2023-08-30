/* eslint-disable no-unused-vars */

/**
 * Custom error class for authentication-related errors.
 */
export class AuthError extends Error {
    /**
     * Create a new instance of AuthError.
     * @param {string} message - The error message.
     * @param {number} errorCode - The error code.
     * @param {string} name - The error name.
     * @param {number} statusCode - The HTTP status code.
     * @param {boolean} [isOperational=false] - Indicates if the error is operational.
     * @param {Date} [timeStamp=new Date()] - The timestamp of when the error occurred.
     */
    constructor(
        public override message: string,
        public errorCode: number,
        public override name: string,
        public statusCode: number,
        public isOperational: boolean = false,
        public timeStamp: Date = new Date(Date.now())
    ) {
        super();
    }

    /**
     * Logs the error details to the console.
     */
    log() {
        console.log(this);
    }
}

/**
 * Enum containing error codes for authentication-related errors.
 */
export enum ErrorCode {
    ACCESS_TOKEN_VALIDATION_ERROR = 3001,
    REFRESH_TOKEN_VALIDATION_ERROR = 3002,
    ACCESS_TOKEN_RENEWAL_ERROR = 3003,
    UNAUTHORIZED_ACCESS_ERROR = 3004
}

/**
 * Enum containing error names for authentication-related errors.
 */
export enum ErrorName {
    ACCESS_TOKEN_VALIDATION_ERROR = 'ACCESS_TOKEN_VALIDATION_ERROR',
    REFRESH_TOKEN_VALIDATION_ERROR = 'REFRESH_TOKEN_VALIDATION_ERROR',
    ACCESS_TOKEN_RENEWAL_ERROR = 'ACCESS_TOKEN_RENEWAL_ERROR',
    UNAUTHORIZED_ACCESS_ERROR = 'UNAUTHORIZED_ACCESS_ERROR'
}

/**
 * Enum containing HTTP status codes for authentication-related errors.
 */
export enum ErrorStatusCode {
    UNAUTHORIZED = 401,
    FORBIDDEN = 403,
    UNPROCESSABLE_ENTITY = 422
}
