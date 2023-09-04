/**
 * Custom error class for validation errors.
 */
export default class ValidationError extends Error {
    /**
     * Create a new instance of ValidationError.
     *
     * @param {string} message - The error message.
     * @param {number} statusCode - The HTTP status code.
     * @param {number} [errorCode = 1001] - The error code.
     * @param {string} [name = "validation Error"] - The error name.
     * @param {boolean} [isOperational=false] - Indicates if the error is operational.
     * @param {Date} [timeStamp=new Date()] - The timestamp of when the error occurred.
     */
    constructor(
        public override message: string,
        public statusCode: number,
        public errorCode: number = 1001,
        public override name: string = 'Validation Error',
        public isOperational: boolean = false,
        public timeStamp: Date = new Date(Date.now())
    ) {
        super();
    }
}
