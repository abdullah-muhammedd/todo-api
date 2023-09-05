import logger from '../_logger/logger ';
/**
 * Custom error class for authentication-related errors.
 */
export default class AuthError extends Error {
    /**
     * Create a new instance of AuthError.
     * @param {string} message - The error message.
     * @param {number} statusCode - The HTTP status code.
     * @param {number} [errorCode = 2001]- The error code.
     * @param {string} [name = "Authinticatio/Authorization Error"] - The error name.
     * @param {boolean} [isOperational=false] - Indicates if the error is operational.
     * @param {Date} [timeStamp=new Date()] - The timestamp of when the error occurred.
     */
    constructor(
        public override message: string,
        public statusCode: number,
        public errorCode: number = 2001,
        public override name: string = 'Authinticatio/Authorization Error',
        public isOperational: boolean = false,
        public timeStamp: Date = new Date(Date.now())
    ) {
        super();
        logger.info(this.toString());
    }
}
