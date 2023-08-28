import Tag, { ITag } from '../model/tag';
import { ErrorCode, ErrorName } from '../utility/_error/ValidationError';
import * as databaseValidation from '../utility/_validation/database';

// Constants Used For Validation Error Handling
const ERROR_CODE = ErrorCode.TAG_DATA_VALIDATION_ERROR;
const ERROR_NAME = ErrorName.TAG_DATA_VALIDATION_ERROR;

/**
 * ~ Get all tags with pagination.
 *
 * @param {number} perPage - The number of tags to retrieve per page.
 * @param {number} page - The page number.
 * @param {string} userId - The user ID to filter tags by.
 * @throws {ValidationError} Throws a `ValidationError` if there are no tags or there's an issue with pagination.
 * @returns {Promise<[ITag]>} A promise that resolves to an array of tags.
 */
export async function getAll(perPage: number = 3, page: number = 1, userId: string): Promise<[ITag]> {
    databaseValidation.isValidId(userId, ERROR_CODE, ERROR_NAME);
    const result = await Tag.find({ userID: userId })
        .skip(perPage * (page - 1))
        .limit(perPage)
        .lean();
    databaseValidation.isEntityExist(result.length, ERROR_CODE, ERROR_NAME);
    return result as [ITag];
}

/**
 * ~ Get a tag by ID.
 *
 * @param {string} id - The ID of the tag to retrieve.
 * @param {string} userId - The user ID to validate ownership.
 * @throws {ValidationError} Throws a `ValidationError` if the provided ID is invalid or the tag does not exist.
 * @returns {Promise<ITag>} A promise that resolves to the retrieved tag.
 */
export async function get(id: string, userId: string): Promise<ITag> {
    databaseValidation.isValidId(id, ERROR_CODE, ERROR_NAME);
    const result = await Tag.findOne({ _id: id, userID: userId }).lean();
    databaseValidation.isEntityExist(result, ERROR_CODE, ERROR_NAME);
    return result as ITag;
}

/**
 * ~ Add a new tag to the database.
 *
 * @param {Object} tagData - The tag data to add.
 * @throws {ValidationError} Throws a `ValidationError` if there's an issue with the data or the user ID is invalid.
 * @returns {Promise<void>} A promise that resolves when the tag is added.
 */
export async function add(tagData: any): Promise<void> {
    databaseValidation.isValidId(tagData.userID, ERROR_CODE, ERROR_NAME);
    await Tag.create(tagData);
}

/**
 * ~ Update a tag in the database.
 *
 * @param {string} id - The ID of the tag to update.
 * @param {Object} tagData - The updated tag data.
 * @param {string} userId - The user ID to validate ownership.
 * @throws {ValidationError} Throws a `ValidationError` if there's an issue with the data or the tag does not exist.
 * @returns {Promise<number>} A promise that resolves to the number of modified tags (0 or 1).
 */
export async function update(id: string, tagData: Object, userId: string): Promise<number> {
    databaseValidation.isValidId(id, ERROR_CODE, ERROR_NAME);
    const result = await Tag.findOneAndUpdate({ _id: id, userID: userId }, tagData);
    databaseValidation.isEntityExist(result, ERROR_CODE, ERROR_NAME);
    return 1;
}

/**
 * ~ Remove a tag from the database by ID.
 *
 * @param {string} id - The ID of the tag to remove.
 * @param {string} userId - The user ID to validate ownership.
 * @throws {ValidationError} Throws a `ValidationError` if there's an issue with the ID or the tag does not exist.
 * @returns {Promise<number>} A promise that resolves to the number of deleted tags (0 or 1).
 */
export async function remove(id: string, userId: string): Promise<number> {
    databaseValidation.isValidId(id, ERROR_CODE, ERROR_NAME);
    const result = await Tag.findOneAndDelete({ _id: id, userID: userId });
    databaseValidation.isEntityExist(result, ERROR_CODE, ERROR_NAME);
    return 1;
}
