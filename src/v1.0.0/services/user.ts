import User, { IUser } from '../model/user';
import { ErrorCode, ErrorName } from '../utility/_error/ValidationError';
import * as databaseValidation from '../utility/_validation/database';

// Constansts Used For Validation Erro Handling
const ERROR_CODE = ErrorCode.USER_DATA_VALIDATION_ERROR;
const ERROR_NAME = ErrorName.USER_DATA_VALIDATION_ERROR;

/**
 * ~ Find a user by ID.
 *
 * @param {string} id - The ID of the user to find.
 * @throws {ValidationError} Throws a `ValidationError` if the provided ID is invalid or the user does not exist.
 * @returns {Promise<any>} A promise that resolves to the found user.
 */
export async function find(id: string): Promise<any | never> {
    databaseValidation.isValidId(id, ERROR_CODE, ERROR_NAME);
    const user = await User.findById(id).select({ password: 0 }).lean();
    databaseValidation.isEntityExist(user, ERROR_CODE, ERROR_NAME);
    return user;
}

/**
 * ~ Find a user by email.
 *
 * @param {string} email - The email of the user to find.
 * @throws {ValidationError} Throws a `ValidationError` if the user does not exist.
 * @returns {Promise<IUser>} A promise that resolves to the found user.
 */
export async function findWithEmail(email: string): Promise<IUser | never> {
    const user = await User.findOne({ email }).lean();
    databaseValidation.isEntityExist(user, ERROR_CODE, ERROR_NAME);
    return user as IUser;
}

/**
 * ~ Find a user by username.
 *
 * @param {string} userName - The username of the user to find.
 * @throws {ValidationError} Throws a `ValidationError` if the user does not exist.
 * @returns {Promise<IUser>} A promise that resolves to the found user.
 */
export async function findWithUserName(userName: string): Promise<IUser | never> {
    const user = await User.findOne({ userName }).lean();
    databaseValidation.isEntityExist(user, ERROR_CODE, ERROR_NAME);
    return user as IUser;
}

/**
 * ~ Add a new user to the database.
 *
 * @param {Object} userData - The user data to add.
 * @throws {ValidationError} Throws a `ValidationError` if there's an issue with the data.
 * @returns {Promise<void>} A promise that resolves when the user is added.
 */
export async function add(userData: Object): Promise<void | never> {
    await User.create(userData);
}

/**
 * ~ Update a user's data in the database.
 *
 * @param {string} id - The ID of the user to update.
 * @param {Object} userData - The updated user data.
 * @throws {ValidationError} Throws a `ValidationError` if there's an issue with the data or the user does not exist.
 * @returns {Promise<number>} A promise that resolves to the number of modified users (0 or 1).
 */
export async function update(id: string, userData: Object): Promise<number | never> {
    databaseValidation.isValidId(id, ERROR_CODE, ERROR_NAME);
    const acknowlegment = await User.updateOne({ _id: id }, userData);
    databaseValidation.isEntityUpdated(acknowlegment, ERROR_CODE, ERROR_NAME);
    return acknowlegment.modifiedCount;
}

/**
 * ~ Remove a user from the database by ID.
 *
 * @param {string} id - The ID of the user to remove.
 * @throws {ValidationError} Throws a `ValidationError` if there's an issue with the ID or the user does not exist.
 * @returns {Promise<number>} A promise that resolves to the number of deleted users (0 or 1).
 */
export async function remove(id: string): Promise<number | never> {
    databaseValidation.isValidId(id, ERROR_CODE, ERROR_NAME);
    const acknowlegment = await User.deleteOne({ _id: id });
    databaseValidation.isEntityDeleted(acknowlegment, ERROR_CODE, ERROR_NAME);
    return acknowlegment.deletedCount;
}
