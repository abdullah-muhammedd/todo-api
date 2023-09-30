import StickyNote, { IStickyNote } from '../model/stickyNote';
import {
    ValidationHelper,
    EntityUpdater,
    EntityDeleter,
    AuthorizationChecker
} from '../utility/_validation/database';

/**
 * Service class for handling sticky note-related operations.
 */
export default class StickyServices {
    /**
     * Get all sticky notes with pagination.
     *
     * @param {number} perPage - The number of sticky notes to retrieve per page.
     * @param {number} page - The page number.
     * @param {string} userID - The Owner ID.
     * @throws {ValidationError} Throws a `ValidationError` if there are no sticky notes or there's an issue with pagination.
     * @returns {Promise<[IStickyNote]>} A promise that resolves to an array of sticky notes.
     */
    static async getAll(
        perPage: number,
        page: number,
        userID: string
    ): Promise<[IStickyNote] | never> {
        ValidationHelper.isValidId(userID);
        const result = await StickyNote.find({ userID })
            .skip(perPage * (page - 1))
            .limit(perPage)
            .select({ userID: 0 })
            .lean();
        ValidationHelper.isEntityExist(result);
        return result as [IStickyNote];
    }

    /**
     * Get a sticky note by ID.
     *
     * @param {string} id - The ID of the sticky note to retrieve.
     * @param {string} userID - The Owner ID.
     * @throws {ValidationError} Throws a `ValidationError` if the provided ID is invalid or the sticky note does not exist.
     * @returns {Promise<IStickyNote>} A promise that resolves to the retrieved sticky note.
     */
    static async get(id: string, userID: string): Promise<Object | never> {
        ValidationHelper.isValidId(userID);
        ValidationHelper.isValidId(id);

        const result = await StickyNote.findById(id).lean();
        ValidationHelper.isEntityExist(result);
        AuthorizationChecker.isOperationAuthorized(userID, result);

        const { userID: _, ...filteredResult } = result as IStickyNote;

        return filteredResult as Object;
    }

    /**
     * Add a new sticky note to the database.
     *
     * @param {Object} stickyNoteData - The sticky note data to add.
     * @throws {ValidationError} Throws a `ValidationError` if there's an issue with the data or the user ID is invalid.
     * @returns {Promise<void>} A promise that resolves when the sticky note is added.
     */
    static async add(stickyNoteData: any): Promise<void | never> {
        ValidationHelper.isValidId(stickyNoteData.userID);
        await StickyNote.create(stickyNoteData);
    }

    /**
     * Update a sticky note in the database.
     *
     * @param {string} id - The ID of the sticky note to update.
     * @param {Object} stickyNoteData - The updated sticky note data.
     * @param {string} userID - The Owner ID.
     * @throws {ValidationError} Throws a `ValidationError` if there's an issue with the data or the sticky note does not exist.
     * @returns {Promise<number>} A promise that resolves to the number of modified sticky notes (0 or 1).
     */
    static async update(
        id: string,
        stickyNoteData: Object,
        userID: string
    ): Promise<number | never> {
        ValidationHelper.isValidId(userID);
        ValidationHelper.isValidId(id);

        const result = await StickyNote.findById(id).lean();
        ValidationHelper.isEntityExist(result);
        AuthorizationChecker.isOperationAuthorized(userID, result);

        const acknowledgment = await StickyNote.updateOne(
            { _id: id },
            stickyNoteData
        );
        EntityUpdater.isEntityUpdated(acknowledgment);
        return acknowledgment.modifiedCount;
    }

    /**
     * Remove a sticky note from the database by ID.
     *
     * @param {string} id - The ID of the sticky note to remove.
     * @param {string} userID - The Owner ID.
     * @throws {ValidationError} Throws a `ValidationError` if there's an issue with the ID or the sticky note does not exist.
     * @returns {Promise<number>} A promise that resolves to the number of deleted sticky notes (0 or 1).
     */
    static async remove(id: string, userID: string): Promise<number | never> {
        ValidationHelper.isValidId(userID);
        ValidationHelper.isValidId(id);

        const result = await StickyNote.findById(id).lean();
        ValidationHelper.isEntityExist(result);
        AuthorizationChecker.isOperationAuthorized(userID, result);

        const acknowledgment = await StickyNote.deleteOne({ _id: id });
        EntityDeleter.isEntityDeleted(acknowledgment);
        return acknowledgment.deletedCount;
    }

    // Get the count of the notes
    static async count(userID: string): Promise<number | never> {
        ValidationHelper.isValidId(userID);
        const count = await StickyNote.count({ userID });
        return count;
    }
}
