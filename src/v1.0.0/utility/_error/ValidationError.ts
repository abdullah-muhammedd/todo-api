/* eslint-disable no-unused-vars */

/**
 * Custom error class for validation errors.
 */
export class ValidationError extends Error {
    /**
     * Create a new instance of ValidationError.
     *
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
 * Enum containing error codes for validation errors.
 */
export enum ErrorCode {
    UNIQUE_INDEX_VALIDATION_ERROR = 1000,
    USER_DATA_VALIDATION_ERROR = 1001,
    LIST_DATA_VALIDATION_ERROR = 1002,
    TAG_DATA_VALIDATION_ERROR = 1003,
    STICKY_DATA_VALIDATION_ERROR = 1004
}

/**
 * Enum containing error names for validation errors.
 */
export enum ErrorName {
    UNIQUE_INDEX_VALIDATION_ERROR = 'UNIQUE_INDEX_VALIDATION_ERROR',
    USER_DATA_VALIDATION_ERROR = 'USER_DATA_VALIDATION_ERROR',
    LIST_DATA_VALIDATION_ERROR = 'LIST_DATA_VALIDATION_ERROR',
    TAG_DATA_VALIDATION_ERROR = 'TAG_DATA_VALIDATION_ERROR',
    STICKY_DATA_VALIDATION_ERROR = 'STICKY_DATA_VALIDATION_ERROR'
}

/**
 * Enum containing HTTP status codes for validation errors.
 */
export enum ErrorStatusCode {
    BAD_REQUEST = 400,
    UNPROCESSABLE_ENTITY = 422
}
