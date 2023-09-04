import { isValidObjectId } from 'mongoose';
import ValidationError from '../_error/ValidationError';
import AuthError from '../_error/AuthError';
import {
    BAD_REQUEST,
    UNPROCESSABLE_ENTITY,
    FORBIDDEN
} from '../_types/statusCodes';

/**
 * Helper class for validation operations.
 */
export class ValidationHelper {
    /**
     * Checks if a provided ID is valid or not. If not valid, it throws a validation error.
     *
     * @param {string} id - The ID to validate.
     * @throws {ValidationError} - Throws a validation error if the ID is not valid.
     */
    static isValidId(id: string): void {
        if (!isValidObjectId(id)) {
            throw new ValidationError('Invalid ID', BAD_REQUEST);
        }
    }

    /**
     * Checks if an entity exists. If not, it throws a validation error.
     *
     * @param {any | null} entity - The entity to check for existence.
     * @throws {ValidationError} - Throws a validation error if the entity does not exist.
     */
    static isEntityExist(entity: any | null): void {
        if (!entity) {
            throw new ValidationError('Entity Not Found', UNPROCESSABLE_ENTITY);
        }
    }
}

/**
 * Helper class for entity update operations.
 */
export class EntityUpdater {
    /**
     * Checks if an entity has been updated. If not, it throws a validation error.
     *
     * @param {any} acknowledgment - The acknowledgment object to check.
     * @throws {ValidationError} - Throws a validation error if the entity has not been updated.
     */
    static isEntityUpdated(acknowledgment: any): void {
        if (
            acknowledgment.matchedCount === 0 ||
            acknowledgment.modifiedCount === 0
        ) {
            throw new ValidationError(
                'Entity Not Updated',
                UNPROCESSABLE_ENTITY
            );
        }
    }
}

/**
 * Helper class for entity deletion operations.
 */
export class EntityDeleter {
    /**
     * Checks if an entity has been deleted. If not, it throws a validation error.
     *
     * @param {any} acknowledgment - The acknowledgment object to check.
     * @throws {ValidationError} - Throws a validation error if the entity has not been deleted.
     */
    static isEntityDeleted(acknowledgment: any): void {
        if (!acknowledgment.acknowledged || acknowledgment.deletedCount === 0) {
            throw new ValidationError(
                'Entity Not Deleted',
                UNPROCESSABLE_ENTITY
            );
        }
    }
}

/**
 * Helper class for handling unique index errors.
 */
export class UniqueIndexErrorHandler {
    /**
     * Handles a database unique index error. If such an error occurs, it throws a validation error.
     *
     * @param {any} error - The error object to check for a unique index error.
     * @throws {ValidationError} - Throws a validation error if a unique index error occurs.
     */
    static isDatabaseUniqueIndexError(error: any): void {
        if (error.name === 'MongoServerError' && error.code === 11000) {
            const fields: string[] = Object.keys(error.keyValue);
            throw new ValidationError(
                `The fields [${fields}] are already in use.`,
                BAD_REQUEST
            );
        }
    }
}

/**
 * Helper class for authorization checks.
 */
export class AuthorizationChecker {
    /**
     * Checks if the user is authorized to perform an operation on an entity.
     *
     * @param {string} userID - The ID of the user attempting the operation.
     * @param {any} entity - The entity on which the operation is being performed.
     * @throws {AuthError} Throws an AuthError if the user is not authorized.
     */
    static isOperationAuthorized(userID: string, entity: any): void {
        if (userID !== entity.userID.toString()) {
            throw new AuthError('Access Denied', FORBIDDEN);
        }
    }
}
