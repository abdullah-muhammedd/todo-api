import List, { IList } from '../model/list';
import { ErrorCode, ErrorName } from '../utility/_error/ValidationError';
import * as databaseValidation from '../utility/_validation/database';

// Constants Used For Validation Error Handling
const ERROR_CODE = ErrorCode.LIST_DATA_VALIDATION_ERROR;
const ERROR_NAME = ErrorName.LIST_DATA_VALIDATION_ERROR;

/**
 *  ~ Get all lists with pagination.
 *
 * @param {number} perPage - The number of items per page.
 * @param {number} page - The page number.
 * @param {string} userId - The user ID to filter lists by.
 * @throws {ValidationError} Throws a `ValidationError` if there are no lists or there's an issue with pagination.
 * @returns {Promise<IList[]>} A promise that resolves to an array of lists.
 */
export async function getAll(perPage: number = 3, page: number = 1, userId: string): Promise<IList[]> {
    databaseValidation.isValidId(userId, ERROR_CODE, ERROR_NAME);
    const result = await List.find({ userID: userId })
        .skip(perPage * (page - 1)) // Adjusted pagination calculation
        .limit(perPage)
        .select({ userID: 0 })
        .lean();
    databaseValidation.isEntityExist(result.length, ERROR_CODE, ERROR_NAME);
    return result;
}

/**
 *  ~ Get a list by ID.
 *
 * @param {string} id - The ID of the list to retrieve.
 * @param {string} userId - The user ID to validate ownership.
 * @throws {ValidationError} Throws a `ValidationError` if the provided ID is invalid or the list does not exist.
 * @returns {Promise<IList>} A promise that resolves to the retrieved list.
 */
export async function get(id: string, userId: string): Promise<IList> {
    databaseValidation.isValidId(id, ERROR_CODE, ERROR_NAME);
    const result = await List.findOne({ _id: id, userID: userId }).select({ userID: 0 }).lean();
    databaseValidation.isEntityExist(result, ERROR_CODE, ERROR_NAME);
    return result as IList;
}

/**
 *  ~ Add a new list to the database.
 *
 * @param {Object} listData - The list data to add.
 * @throws {ValidationError} Throws a `ValidationError` if there's an issue with the data or the user ID is invalid.
 * @returns {Promise<void>} A promise that resolves when the list is added.
 */
export async function add(listData: any): Promise<void> {
    databaseValidation.isValidId(listData.userID, ERROR_CODE, ERROR_NAME);
    await List.create(listData);
}

/**
 *  ~ Update a list in the database.
 *
 * @param {string} id - The ID of the list to update.
 * @param {Object} listData - The updated list data.
 * @param {string} userId - The user ID to validate ownership.
 * @throws {ValidationError} Throws a `ValidationError` if there's an issue with the data or the list does not exist.
 * @returns {Promise<number>} A promise that resolves to the number of modified lists (0 or 1).
 */
export async function update(id: string, listData: object, userId: string): Promise<number> {
    databaseValidation.isValidId(id, ERROR_CODE, ERROR_NAME);
    const result = await List.findOneAndUpdate({ _id: id, userID: userId }, listData);
    databaseValidation.isEntityExist(result, ERROR_CODE, ERROR_NAME);
    return 1; // It will always be 1 because of its unique id
}

/**
 *  ~ Remove a list from the database by ID.
 *
 * @param {string} id - The ID of the list to remove.
 * @param {string} userId - The user ID to validate ownership.
 * @throws {ValidationError} Throws a `ValidationError` if there's an issue with the ID or the list does not exist.
 * @returns {Promise<number>} A promise that resolves to the number of deleted lists (0 or 1).
 */
export async function remove(id: string, userId: string): Promise<number> {
    databaseValidation.isValidId(id, ERROR_CODE, ERROR_NAME);
    const result = await List.findOneAndDelete({ _id: id, userID: userId });
    databaseValidation.isEntityExist(result, ERROR_CODE, ERROR_NAME);
    return 1; // It will always be 1 because of its unique id
}
