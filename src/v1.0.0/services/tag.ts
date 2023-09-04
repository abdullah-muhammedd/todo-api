import Tag, { ITag } from '../model/tag';
import { ValidationHelper, EntityUpdater, EntityDeleter, AuthorizationChecker } from '../utility/_validation/database';

/**
 * Service class for handling tag-related operations.
 */
export default class TagServices {
    /**
     * Get all tags with pagination.
     *
     * @param {number} perPage - The number of tags to retrieve per page.
     * @param {number} page - The page number.
     * @param {string} userID - The Owner ID
     * @throws {ValidationError} Throws a `ValidationError` if there are no tags or there's an issue with pagination.
     * @returns {Promise<[ITag]>} A promise that resolves to an array of tags.
     */
    static async getAll(perPage: number, page: number, userID: string): Promise<[ITag] | never> {
        ValidationHelper.isValidId(userID);
        const result = await Tag.find({ userID })
            .skip(perPage * (page - 1))
            .limit(perPage)
            .select({ userID: 0 })
            .lean();
        ValidationHelper.isEntityExist(result);
        return result as [ITag];
    }

    /**
     * Get a tag by ID.
     *
     * @param {string} id - The ID of the tag to retrieve.
     * @param {string} userID - The Owner ID.
     * @throws {ValidationError} Throws a `ValidationError` if the provided ID is invalid or the tag does not exist.
     * @returns {Promise<ITag>} A promise that resolves to the retrieved tag.
     */
    static async get(id: string, userID: string): Promise<Object | never> {
        ValidationHelper.isValidId(userID);
        ValidationHelper.isValidId(id);

        const result = await Tag.findById(id).lean();
        ValidationHelper.isEntityExist(result);
        AuthorizationChecker.isOperationAuthorized(userID, result);

        const { userID: _, ...filteredResult } = result as ITag;

        return filteredResult as Object;
    }

    /**
     * Add a new tag to the database.
     *
     * @param {Object} tagData - The tag data to add.
     * @throws {ValidationError} Throws a `ValidationError` if there's an issue with the data or the user ID is invalid.
     * @returns {Promise<void>} A promise that resolves when the tag is added.
     */
    static async add(tagData: any): Promise<void> {
        ValidationHelper.isValidId(tagData.userID);
        await Tag.create(tagData);
    }

    /**
     * Update a tag in the database.
     *
     * @param {string} id - The ID of the tag to update.
     * @param {Object} tagData - The updated tag data.
     * @param {string} userID - The Owner ID.
     * @throws {ValidationError} Throws a `ValidationError` if there's an issue with the data or the tag does not exist.
     * @returns {Promise<number>} A promise that resolves to the number of modified tags (0 or 1).
     */
    static async update(id: string, tagData: Object, userID: string): Promise<number | never> {
        ValidationHelper.isValidId(userID);
        ValidationHelper.isValidId(id);

        const result = await Tag.findById(id).lean();
        ValidationHelper.isEntityExist(result);
        AuthorizationChecker.isOperationAuthorized(userID, result);

        const acknowledgment = await Tag.updateOne({ _id: id }, tagData);
        EntityUpdater.isEntityUpdated(acknowledgment);

        return acknowledgment.modifiedCount;
    }

    /**
     * Remove a tag from the database by ID.
     *
     * @param {string} id - The ID of the tag to remove.
     * @param {string} userID - The Owner ID.
     * @throws {ValidationError} Throws a `ValidationError` if there's an issue with the ID or the tag does not exist.
     * @returns {Promise<number>} A promise that resolves to the number of deleted tags (0 or 1).
     */
    static async remove(id: string, userID: string): Promise<number> {
        ValidationHelper.isValidId(userID);
        ValidationHelper.isValidId(id);

        const result = await Tag.findById(id).lean();
        ValidationHelper.isEntityExist(result);
        AuthorizationChecker.isOperationAuthorized(userID, result);

        const acknowledgment = await Tag.deleteOne({ _id: id });
        EntityDeleter.isEntityDeleted(acknowledgment);
        return acknowledgment.deletedCount;
    }
}
