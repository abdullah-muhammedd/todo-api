import User, { IUser } from '../model/user';
import { ValidationHelper, EntityUpdater, EntityDeleter } from '../utility/_validation/database';

/**
 * Helper class for user-related operations.
 */
export default class UserServices {
    /**
     * Find a user by ID.
     *
     * @param {string} id - The ID of the user to find.
     * @throws {ValidationError} Throws a `ValidationError` if the provided ID is invalid or the user does not exist.
     * @returns {Promise<any>} A promise that resolves to the found user.
     */
    static async find(id: string): Promise<any | never> {
        ValidationHelper.isValidId(id);
        const user = await User.findById(id).select({ password: 0 }).lean();
        ValidationHelper.isEntityExist(user);
        return user;
    }

    /**
     * Find a user by email.
     *
     * @param {string} email - The email of the user to find.
     * @throws {ValidationError} Throws a `ValidationError` if the user does not exist.
     * @returns {Promise<IUser>} A promise that resolves to the found user.
     */
    static async findWithEmail(email: string): Promise<IUser | never> {
        const user = await User.findOne({ email }).lean();
        ValidationHelper.isEntityExist(user);
        return user as IUser;
    }

    /**
     * Find a user by username.
     *
     * @param {string} userName - The username of the user to find.
     * @throws {ValidationError} Throws a `ValidationError` if the user does not exist.
     * @returns {Promise<IUser>} A promise that resolves to the found user.
     */
    static async findWithUserName(userName: string): Promise<IUser | never> {
        const user = await User.findOne({ userName }).lean();
        ValidationHelper.isEntityExist(user);
        return user as IUser;
    }

    /**
     * Add a new user to the database.
     *
     * @param {Object} userData - The user data to add.
     * @throws {ValidationError} Throws a `ValidationError` if there's an issue with the data.
     * @returns {Promise<void>} A promise that resolves when the user is added.
     */
    static async add(userData: Object): Promise<void | never> {
        await User.create(userData);
    }

    /**
     * Update a user's data in the database.
     *
     * @param {string} id - The ID of the user to update.
     * @param {Object} userData - The updated user data.
     * @throws {ValidationError} Throws a `ValidationError` if there's an issue with the data or the user does not exist.
     * @returns {Promise<number>} A promise that resolves to the number of modified users (0 or 1).
     */
    static async update(id: string, userData: Object): Promise<number | never> {
        ValidationHelper.isValidId(id);
        const acknowledgment = await User.updateOne({ _id: id }, userData);
        EntityUpdater.isEntityUpdated(acknowledgment);
        return acknowledgment.modifiedCount;
    }

    /**
     * Remove a user from the database by ID.
     *
     * @param {string} id - The ID of the user to remove.
     * @throws {ValidationError} Throws a `ValidationError` if there's an issue with the ID or the user does not exist.
     * @returns {Promise<number>} A promise that resolves to the number of deleted users (0 or 1).
     */
    static async remove(id: string): Promise<number | never> {
        ValidationHelper.isValidId(id);
        const acknowledgment = await User.deleteOne({ _id: id });
        EntityDeleter.isEntityDeleted(acknowledgment);
        return acknowledgment.deletedCount;
    }
}
