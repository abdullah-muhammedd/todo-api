import List, { IList } from '../model/list';
import { ValidationHelper, EntityUpdater, EntityDeleter, AuthorizationChecker } from '../utility/_validation/database';

/**
 * Service class for handling list-related operations.
 */
export default class ListServices {
    /**
     * Get all lists with pagination.
     *
     * @param {number} perPage - The number of items per page.
     * @param {number} page - The page number.
     * @param {string} userID - Owner ID.
     * @throws {ValidationError} Throws a `ValidationError` if there are no lists or there's an issue with pagination.
     * @returns {Promise<[IList]>} A promise that resolves to an array of lists.
     */
    static async getAll(perPage: number = 3, page: number = 1, userID: string): Promise<[IList] | never> {
        ValidationHelper.isValidId(userID);
        const result = await List.find({ userID })
            .skip(perPage * (page - 1))
            .limit(perPage)
            .select({ userID: 0 })
            .lean();
        ValidationHelper.isEntityExist(result);
        return result as [IList];
    }

    /**
     * Get a list by ID.
     *
     * @param {string} id - The ID of the list to retrieve.
     * @param {string} userID - The Owner ID.
     * @throws {ValidationError} Throws a `ValidationError` if the provided ID is invalid or the list does not exist.
     * @returns {Promise<IList>} A promise that resolves to the retrieved list.
     */
    static async get(id: string, userID: string): Promise<Object | never> {
        ValidationHelper.isValidId(userID);
        ValidationHelper.isValidId(id);

        const result = await List.findById(id).lean();
        ValidationHelper.isEntityExist(result);
        AuthorizationChecker.isOperationAuthorized(userID, result);

        const { userID: _, ...filteredResult } = result as IList;

        return filteredResult as Object;
    }

    /**
     * Add a new list to the database.
     *
     * @param {Object} listData - The list data to add.
     * @throws {ValidationError} Throws a `ValidationError` if there's an issue with the data or the user ID is invalid.
     * @returns {Promise<void>} A promise that resolves when the list is added.
     */
    static async add(listData: any): Promise<void> {
        ValidationHelper.isValidId(listData.userID);
        await List.create(listData);
    }

    /**
     * Update a list in the database.
     *
     * @param {string} id - The ID of the list to update.
     * @param {Object} listData - The updated list data.
     * @param {string} userID - The Owner ID.
     * @throws {ValidationError} Throws a `ValidationError` if there's an issue with the data or the list does not exist.
     * @returns {Promise<number>} A promise that resolves to the number of modified lists (0 or 1).
     */
    static async update(id: string, listData: object, userID: string): Promise<number | never> {
        ValidationHelper.isValidId(userID);
        ValidationHelper.isValidId(id);

        const result = await List.findById(id).lean();
        ValidationHelper.isEntityExist(result);
        AuthorizationChecker.isOperationAuthorized(userID, result);

        const acknowledgment = await List.updateOne({ _id: id }, listData);
        EntityUpdater.isEntityUpdated(acknowledgment);
        return acknowledgment.modifiedCount;
    }

    /**
     * Remove a list from the database by ID.
     *
     * @param {string} id - The ID of the list to remove.
     * @param {string} userID - The Owner ID.
     * @throws {ValidationError} Throws a `ValidationError` if there's an issue with the ID or the list does not exist.
     * @returns {Promise<number>} A promise that resolves to the number of deleted lists (0 or 1).
     */
    static async remove(id: string, userID: string): Promise<number | never> {
        ValidationHelper.isValidId(userID);
        ValidationHelper.isValidId(id);

        const result = await List.findById(id).lean();
        ValidationHelper.isEntityExist(result);
        AuthorizationChecker.isOperationAuthorized(userID, result);

        const acknowledgment = await List.deleteOne({ _id: id });
        EntityDeleter.isEntityDeleted(acknowledgment);
        return acknowledgment.deletedCount;
    }
}
