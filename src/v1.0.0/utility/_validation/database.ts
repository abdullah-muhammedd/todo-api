import { isValidObjectId } from 'mongoose';
import { ValidationError, ErrorStatusCode } from '../_error/ValidationError';
import { AuthError, ErrorCode, ErrorName, ErrorStatusCode as AuthErrorStatusCode } from '../_error/AuthError';

/**
 * Checks if a provided ID is valid or not. If not valid, it throws a validation error.
 *
 * @param {string} id - The ID to validate.
 * @param {number} errorCode - The error code to use in the validation error.
 * @param {string} errorName - The error name to use in the validation error.
 * @throws {ValidationError} - Throws a validation error if the ID is not valid.
 */
export function isValidId(id: string, errorCode: number, errorName: string): void | never {
    if (!isValidObjectId(id)) {
        throw new ValidationError('ID Is Not A Valid Id', errorCode, errorName, ErrorStatusCode.BAD_REQUEST);
    }
}

/**
 * Checks if an entity exists. If not, it throws a validation error.
 *
 * @param {any} entity - The entity to check for existence.
 * @param {number} errorCode - The error code to use in the validation error.
 * @param {string} errorName - The error name to use in the validation error.
 * @throws {ValidationError} - Throws a validation error if the entity does not exist.
 */
export function isEntityExist(entity: any, errorCode: number, errorName: string): void | never {
    if (!entity) {
        throw new ValidationError('Entity Not Found', errorCode, errorName, ErrorStatusCode.UNPROCESSABLE_ENTITY);
    }
}

/**
 * Checks if an entity has been updated. If not, it throws a validation error.
 *
 * @param {any} acknowlegment - The acknowledgment object to check.
 * @param {number} errorCode - The error code to use in the validation error.
 * @param {string} errorName - The error name to use in the validation error.
 * @throws {ValidationError} - Throws a validation error if the entity has not been updated.
 */
export function isEntityUpdated(acknowlegment: any, errorCode: number, errorName: string): void | never {
    if (acknowlegment.matchedCount === 0) {
        throw new ValidationError('Entity Not Found ', errorCode, errorName, ErrorStatusCode.BAD_REQUEST);
    }
    if (acknowlegment.modifiedCount === 0) {
        throw new ValidationError('Entity Is Not Updated', errorCode, errorName, ErrorStatusCode.UNPROCESSABLE_ENTITY);
    }
}

/**
 * Checks if an entity has been deleted. If not, it throws a validation error.
 *
 * @param {any} acknowlegment - The acknowledgment object to check.
 * @param {number} errorCode - The error code to use in the validation error.
 * @param {string} errorName - The error name to use in the validation error.
 * @throws {ValidationError} - Throws a validation error if the entity has not been deleted.
 */
export function isEntityDeleted(acknowlegment: any, errorCode: number, errorName: string): void | never {
    if (acknowlegment.acknowledged === false) {
        throw new ValidationError('Entity Not Found ', errorCode, errorName, ErrorStatusCode.UNPROCESSABLE_ENTITY);
    }
    if (acknowlegment.deletedCount === 0) {
        throw new ValidationError('Entity Is Not Deleted', errorCode, errorName, ErrorStatusCode.UNPROCESSABLE_ENTITY);
    }
}

/**
 * Handles a database unique index error. If such an error occurs, it throws a validation error.
 *
 * @param {any} error - The error object to check for a unique index error.
 * @param {number} errorCode - The error code to use in the validation error.
 * @param {string} errorName - The error name to use in the validation error.
 * @throws {ValidationError} - Throws a validation error if a unique index error occurs.
 */
export function isDatabaseUniqueIndexError(error: any, errorCode: number, errorName: string) {
    if (error.name === 'MongoServerError' && error.code === 11000) {
        const fields: string[] = [];
        for (const k in error.keyValue) {
            fields.push(k);
        }
        throw new ValidationError(
            `The Fields \`${fields}\` Are Already Used Before`,
            errorCode,
            errorName,
            ErrorStatusCode.UNPROCESSABLE_ENTITY
        );
    }
}

/**
 * Checks if the user is authorized to perform an operation on an entity.
 *
 * @param {string} userID - The ID of the user attempting the operation.
 * @param {object} entity - The entity on which the operation is being performed.
 * @throws {AuthError} Throws an AuthError if the user is not authorized.
 */
export function isOperationAuthorized(userID: string, entity: any): void | never {
    console.log(userID);
    console.log(entity.userID);

    // Compare the user ID with the entity's user ID
    if (userID !== entity.userID.toString()) {
        throw new AuthError(
            'Access Denied',
            ErrorCode.UNAUTHORIZED_ACCESS_ERROR,
            ErrorName.UNAUTHORIZED_ACCESS_ERROR,
            AuthErrorStatusCode.FORBIDDEN
        );
    }
}
