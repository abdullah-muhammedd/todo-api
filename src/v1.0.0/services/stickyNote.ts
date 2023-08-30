import StickyNote, { IStickyNote } from '../model/stickyNote';
import { ErrorCode, ErrorName } from '../utility/_error/ValidationError';
import * as databaseValidation from '../utility/_validation/database';

// Constansts Used For Validation Erro Handling
const ERROR_CODE = ErrorCode.STICKY_DATA_VALIDATION_ERROR;
const ERROR_NAME = ErrorName.STICKY_DATA_VALIDATION_ERROR;

/**
 * ~ Get all sticky notes with pagination.
 *
 * @param {number} perPage - The number of sticky notes to retrieve per page.
 * @param {number} page - The page number.
 * @param {string} userID - The Owner ID.
 * @throws {ValidationError} Throws a `ValidationError` if there are no sticky notes or there's an issue with pagination.
 * @returns {Promise<[IStickyNote]>} A promise that resolves to an array of sticky notes.
 */
export async function getAll(perPage: number = 9, page = 1, userID: string): Promise<[IStickyNote] | never> {
    databaseValidation.isValidId(userID, ERROR_CODE, ERROR_NAME);
    const result = await StickyNote.find({ userID })
        .skip(perPage * (page - 1))
        .limit(perPage)
        .select({ userID: 0 })
        .lean();
    databaseValidation.isEntityExist(result, ERROR_CODE, ERROR_NAME);
    return result as [IStickyNote];
}

/**
 * ~ Get a sticky note by ID.
 *
 * @param {string} id - The ID of the sticky note to retrieve.
 * @param {string} userID - The Owner ID.
 * @throws {ValidationError} Throws a `ValidationError` if the provided ID is invalid or the sticky note does not exist.
 * @returns {Promise<IStickyNote>} A promise that resolves to the retrieved sticky note.
 */
export async function get(id: string, userID: string): Promise<Object | never> {
    databaseValidation.isValidId(userID, ERROR_CODE, ERROR_NAME);
    databaseValidation.isValidId(id, ERROR_CODE, ERROR_NAME);

    const result = await StickyNote.findById(id).lean();
    databaseValidation.isEntityExist(result, ERROR_CODE, ERROR_NAME);
    databaseValidation.isOperationAuthorized(userID, result);

    const { userID: _, ...filteredResult } = result as IStickyNote;

    return filteredResult as Object;
}

/**
 * ~ Add a new sticky note to the database.
 *
 * @param {Object} stickyNoteData - The sticky note data to add.
 * @throws {ValidationError} Throws a `ValidationError` if there's an issue with the data or the user ID is invalid.
 * @returns {Promise<void>} A promise that resolves when the sticky note is added.
 */
export async function add(stickyNoteData: any): Promise<void | never> {
    databaseValidation.isValidId(stickyNoteData.userID, ERROR_CODE, ERROR_NAME);
    await StickyNote.create(stickyNoteData);
}

/**
 * ~ Update a sticky note in the database.
 *
 * @param {string} id - The ID of the sticky note to update.
 * @param {Object} stickyNoteData - The updated sticky note data.
 * @param {string} userID - The Owner ID.
 * @throws {ValidationError} Throws a `ValidationError` if there's an issue with the data or the sticky note does not exist.
 * @returns {Promise<number>} A promise that resolves to the number of modified sticky notes (0 or 1).
 */
export async function update(id: string, stickyNoteData: Object, userID: string): Promise<number | never> {
    databaseValidation.isValidId(userID, ERROR_CODE, ERROR_NAME);
    databaseValidation.isValidId(id, ERROR_CODE, ERROR_NAME);

    const result = await StickyNote.findById(id).lean();
    databaseValidation.isEntityExist(result, ERROR_CODE, ERROR_NAME);
    databaseValidation.isOperationAuthorized(userID, result);

    const acknowledgment = await StickyNote.updateOne({ _id: id }, stickyNoteData);
    databaseValidation.isEntityUpdated(acknowledgment, ERROR_CODE, ERROR_NAME);
    return acknowledgment.modifiedCount;
}

/**
 * ~ Remove a sticky note from the database by ID.
 *
 * @param {string} id - The ID of the sticky note to remove.
 * @param {string} userID - The Owner ID.
 * @throws {ValidationError} Throws a `ValidationError` if there's an issue with the ID or the sticky note does not exist.
 * @returns {Promise<number>} A promise that resolves to the number of deleted sticky notes (0 or 1).
 */
export async function remove(id: string, userID: string): Promise<number | never> {
    databaseValidation.isValidId(userID, ERROR_CODE, ERROR_NAME);
    databaseValidation.isValidId(id, ERROR_CODE, ERROR_NAME);

    const result = await StickyNote.findById(id).lean();
    databaseValidation.isEntityExist(result, ERROR_CODE, ERROR_NAME);
    databaseValidation.isOperationAuthorized(userID, result);

    const acknowledgment = await StickyNote.deleteOne({ _id: id });
    databaseValidation.isEntityUpdated(acknowledgment, ERROR_CODE, ERROR_NAME);
    return acknowledgment.deletedCount;
}
