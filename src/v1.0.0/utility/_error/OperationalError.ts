/* eslint-disable no-unused-vars */

/**
 * Custom error class for operational errors.
 */
class OperationalError extends Error {
    /**
     * Create a new instance of OperationalError.
     *
     * @param {string} [message='Internal Server Error'] - The error message.
     * @param {number} [errorCode=5005] - The error code.
     * @param {string} [name='INTERNAL_SERVER_ERROR'] - The error name.
     * @param {number} [statusCode=500] - The HTTP status code.
     * @param {boolean} [isOperational=true] - Indicates if the error is operational.
     * @param {Date} [timeStamp=new Date()] - The timestamp of when the error occurred.
     */
    constructor(
        public override message: string = 'Internal Server Error',
        public errorCode: number = 5005,
        public override name: string = 'INTERNAL_SERVER_ERROR',
        public statusCode: number = 500,
        public isOperational: boolean = true,
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

export default OperationalError;
