import Task, { ITask } from '../model/task';
import {
    ValidationHelper,
    EntityUpdater,
    EntityDeleter,
    AuthorizationChecker
} from '../utility/_validation/database';

// Types
type TaskQuery = {
    userID: string;
    dueDateFrom: string | null;
    dueDateTo: string | null;
    done: boolean | null;
};

/**
 * Service class for handling task-related operations.
 */
export default class TaskServices {
    /**
     * Get all tasks with pagination.
     *
     * @param {number} perPage - The number of items per page.
     * @param {number} page - The page number.
     * @param {TaskQuery} queryParams - Filtering Query Parameters.
     * @throws {ValidationError} Throws a `ValidationError` if there are no tasks or there's an issue with pagination.
     * @returns {Promise<[ITask]>} A promise that resolves to an array of tasks.
     */
    static async getAll(
        perPage: number,
        page: number,
        queryParams: TaskQuery
    ): Promise<[ITask] | never> {
        ValidationHelper.isValidId(queryParams.userID);

        const cleanedQuery: any = {};
        cleanedQuery.userID = queryParams.userID;

        // Clean the query params to ignore null or undefined values of the dueDate
        if (queryParams.dueDateFrom && queryParams.dueDateTo) {
            cleanedQuery.$and = [
                { dueDate: { $gte: queryParams.dueDateFrom } },
                { dueDate: { $lte: queryParams.dueDateTo } }
            ];
        } else if (queryParams.dueDateFrom) {
            cleanedQuery.dueDate = { $gte: queryParams.dueDateFrom };
        } else if (queryParams.dueDateTo) {
            cleanedQuery.dueDate = { $lte: queryParams.dueDateTo };
        }

        // Continue cleaning the query params to ignore the null values of done field
        if (queryParams.done) {
            cleanedQuery.done = queryParams.done;
        }
        // Making the database query
        const result = await Task.find(cleanedQuery)
            .populate({ path: 'listID', select: 'heading color' })
            .populate({ path: 'tagID', select: 'heading color' })
            .skip(perPage * (page - 1))
            .limit(perPage)
            .select({ userID: 0 })
            .lean();
        ValidationHelper.isEntityExist(result);
        return result as [ITask];
    }

    /**
     * Get a task by ID.
     *
     * @param {string} id - The ID of the task to retrieve.
     * @param {string} userID - The Owner ID.
     * @throws {ValidationError} Throws a `ValidationError` if the provided ID is invalid or the task does not exist.
     * @returns {Promise<ITask>} A promise that resolves to the retrieved task.
     */
    static async get(id: string, userID: string): Promise<Object | never> {
        ValidationHelper.isValidId(userID);
        ValidationHelper.isValidId(id);

        const result = await Task.findById(id)
            .populate({ path: 'listID', select: 'heading color' })
            .populate({ path: 'tagID', select: 'heading color' })
            .lean();
        ValidationHelper.isEntityExist(result);
        AuthorizationChecker.isOperationAuthorized(userID, result);

        const { userID: _, ...filteredResult } = result as ITask;

        return filteredResult as Object;
    }

    /**
     * Add a new task to the database.
     *
     * @param {any} taskData - The task data to add.
     * @throws {ValidationError} Throws a `ValidationError` if there's an issue with the data or the user ID is invalid.
     * @returns {Promise<void>} A promise that resolves when the task is added.
     */
    static async add(taskData: any): Promise<void | never> {
        ValidationHelper.isValidId(taskData.userID);
        if (taskData.listID) ValidationHelper.isValidId(taskData.listID);
        if (taskData.tagID) ValidationHelper.isValidId(taskData.tagID);
        await Task.create(taskData);
    }

    /**
     * Update a task in the database.
     *
     * @param {string} id - The ID of the task to update.
     * @param {any} taskData - The updated task data.
     * @param {string} userID - The Owner ID.
     * @throws {ValidationError} Throws a `ValidationError` if there's an issue with the data or the task does not exist.
     * @returns {Promise<number>} A promise that resolves to the number of modified tasks (0 or 1).
     */
    static async update(
        id: string,
        taskData: any,
        userID: string
    ): Promise<number | never> {
        ValidationHelper.isValidId(userID);
        ValidationHelper.isValidId(id);

        const result = await Task.findById(id).lean();
        ValidationHelper.isEntityExist(result);
        AuthorizationChecker.isOperationAuthorized(userID, result);

        if (taskData.listID) ValidationHelper.isValidId(taskData.listID);
        if (taskData.tagID) ValidationHelper.isValidId(taskData.tagID);

        const acknowledgment = await Task.updateOne({ _id: id }, taskData);
        EntityUpdater.isEntityUpdated(acknowledgment);
        return acknowledgment.modifiedCount;
    }

    /**
     * Remove a task from the database by ID.
     *
     * @param {string} id - The ID of the task to remove.
     * @param {string} userID - The Owner ID.
     * @throws {ValidationError} Throws a `ValidationError` if there's an issue with the ID or the task does not exist.
     * @returns {Promise<number>} A promise that resolves to the number of deleted tasks (0 or 1).
     */
    static async remove(id: string, userID: string): Promise<number | never> {
        ValidationHelper.isValidId(userID);
        ValidationHelper.isValidId(id);

        const result = await Task.findById(id).lean();
        ValidationHelper.isEntityExist(result);
        AuthorizationChecker.isOperationAuthorized(userID, result);

        const acknowledgment = await Task.deleteOne({ _id: id });
        EntityDeleter.isEntityDeleted(acknowledgment);
        return acknowledgment.deletedCount;
    }

    /**
     * Toggle the 'done' status of a task.
     *
     * @param {string} id - The ID of the task to update.
     * @param {string} userID - The Owner ID.
     * @throws {ValidationError} Throws a `ValidationError` if there's an issue with the ID, the task does not exist, or the user is not authorized.
     * @returns {Promise<number>} A promise that resolves to the modified count (1 if successful).
     */
    static async changeDoneStatus(id: string, userID: string): Promise<number> {
        ValidationHelper.isValidId(userID);
        ValidationHelper.isValidId(id);

        const result = await Task.findById(id).lean();
        ValidationHelper.isEntityExist(result);
        AuthorizationChecker.isOperationAuthorized(userID, result);

        const newDoneStatus = result ? !result.done : true;
        const acknowledgment = await Task.updateOne(
            { _id: id },
            { done: newDoneStatus }
        );
        EntityUpdater.isEntityUpdated(acknowledgment);

        return acknowledgment.modifiedCount; // as the modified count
    }

    /**
     * Get all tasks with pagination in a specific list.
     *
     * @param {number} perPage - The number of items per page.
     * @param {number} page - The page number.
     * @param {string} userID - Owner ID.
     * @param {string} listID - list ID.
     * @throws {ValidationError} Throws a `ValidationError` if there are no tasks or there's an issue with pagination.
     * @returns {Promise<[ITask]>} A promise that resolves to an array of tasks.
     */
    static async getAllByList(
        perPage: number,
        page: number,
        userID: string,
        listID: string
    ): Promise<[ITask] | never> {
        ValidationHelper.isValidId(userID);
        ValidationHelper.isValidId(listID);

        // Making the database query
        const result = await Task.find({ userID, listID })
            .populate({ path: 'listID', select: 'heading color' })
            .populate({ path: 'tagID', select: 'heading color' })
            .skip(perPage * (page - 1))
            .limit(perPage)
            .select({ userID: 0 })
            .lean();
        ValidationHelper.isEntityExist(result);
        return result as [ITask];
    }

    /**
     * Get all tasks with pagination in a specific tag.
     *
     * @param {number} perPage - The number of items per page.
     * @param {number} page - The page number.
     * @param {string} userID - Owner ID.
     * @param {string} tagID - tag ID.
     * @throws {ValidationError} Throws a `ValidationError` if there are no tasks or there's an issue with pagination.
     * @returns {Promise<[ITask]>} A promise that resolves to an array of tasks.
     */
    static async getAllByTag(
        perPage: number,
        page: number,
        userID: string,
        tagID: string
    ): Promise<[ITask] | never> {
        ValidationHelper.isValidId(userID);
        ValidationHelper.isValidId(tagID);

        // Making the database query
        const result = await Task.find({ userID, tagID })
            .populate({ path: 'listID', select: 'heading color' })
            .populate({ path: 'tagID', select: 'heading color' })
            .skip(perPage * (page - 1))
            .limit(perPage)
            .select({ userID: 0 })
            .lean();
        ValidationHelper.isEntityExist(result);
        return result as [ITask];
    }
}
