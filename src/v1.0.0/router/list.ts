import { Router } from 'express';
import * as listController from '../controller/list';
import { isAuthenticated } from '../middleware/auth';

const router = Router();

/**
 * @route GET /lists
 * @description Get a list of lists.
 * @access Private (requires authentication)
 */
router.get('/lists', isAuthenticated, listController.getLists);

/**
 * @route GET /lists/count
 * @description get number of lists
 * @access Private (requires authentication)
 */
router.get('/lists/count', isAuthenticated, listController.countLists);

/**
 * @route GET /lists/:id
 * @description Get a list by ID.
 * @param {string} id - The ID of the list.
 * @access Private (requires authentication)
 */
router.get('/lists/:id', isAuthenticated, listController.getList);

/**
 * @route POST /lists
 * @description Create a new list.
 * @access Private (requires authentication)
 */
router.post('/lists', isAuthenticated, listController.postList);

/**
 * @route PATCH /lists/:id
 * @description Update a list by ID.
 * @param {string} id - The ID of the list to update.
 * @access Private (requires authentication)
 */
router.patch('/lists/:id', isAuthenticated, listController.patchList);

/**
 * @route DELETE /lists/:id
 * @description Delete a list by ID.
 * @param {string} id - The ID of the list to delete.
 * @access Private (requires authentication)
 */
router.delete('/lists/:id', isAuthenticated, listController.deleteList);

router.get('/lists/count');
export default router;
