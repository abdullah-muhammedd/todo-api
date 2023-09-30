import { Router } from 'express';
import * as taskController from '../controller/task';
import { isAuthenticated } from '../middleware/auth';

const router = Router();

/**
 * @route GET /tasks
 * @description Get all tasks.
 * @access Private (requires authentication)
 */
router.get('/tasks', isAuthenticated, taskController.getTasks);

/**
 * @route GET /tasks/count
 * @description get number of tasks
 * @access Private (requires authentication)
 */
router.get('/tasks/count', isAuthenticated, taskController.countTasks);

/**
 * @route GET /tasks/:id
 * @description Get a task by ID.
 * @param {string} id - The ID of the task to retrieve.
 * @access Private (requires authentication)
 */

router.get('/tasks/:id', isAuthenticated, taskController.getTask);

/**
 * @route GET /tasks/lists/:listId
 * @description Get tasks by list ID.
 * @param {string} listId - The ID of the list to filter tasks by.
 * @access Private (requires authentication)
 */
router.get(
    '/tasks/lists/:listId',
    isAuthenticated,
    taskController.getTasksByList
);

/**
 * @route GET /tasks/tags/:tagId
 * @description Get tasks by tag ID.
 * @param {string} tagId - The ID of the tag to filter tasks by.
 * @access Private (requires authentication)
 */
router.get('/tasks/tags/:tagId', isAuthenticated, taskController.getTasksByTag);

/**
 * @route POST /tasks
 * @description Create a new task.
 * @access Private (requires authentication)
 */
router.post('/tasks', isAuthenticated, taskController.postTask);

/**
 * @route PATCH /tasks/:id
 * @description Update a task by ID.
 * @param {string} id - The ID of the task to update.
 * @access Private (requires authentication)
 */
router.patch('/tasks/:id', isAuthenticated, taskController.patchTask);

/**
 * @route PATCH /tasks/:id/toggle-done
 * @description Toggle the 'done' status of a task by ID.
 * @param {string} id - The ID of the task to toggle.
 * @access Private (requires authentication)
 */
router.patch(
    '/tasks/:id/toggle-done',
    isAuthenticated,
    taskController.patchToggleDone
);

/**
 * @route DELETE /tasks/:id
 * @description Delete a task by ID.
 * @param {string} id - The ID of the task to delete.
 * @access Private (requires authentication)
 */
router.delete('/tasks/:id', isAuthenticated, taskController.deleteTask);

export default router;
