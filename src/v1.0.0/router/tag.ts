import { Router } from 'express';
import * as tagController from '../controller/tag';
import { isAuthenticated } from '../middleware/auth';

const router = Router();

/**
 * @route GET /tags
 * @description Get a list of tags.
 * @access Private (requires authentication)
 */
router.get('/tags', isAuthenticated, tagController.getTags);

/**
 * @route GET /tags/:id
 * @description Get a tag by ID.
 * @param {string} id - The ID of the tag.
 * @access Private (requires authentication)
 */
router.get('/tags/:id', isAuthenticated, tagController.getTag);

/**
 * @route POST /tags
 * @description Create a new tag.
 * @access Private (requires authentication)
 */
router.post('/tags', isAuthenticated, tagController.postTag);

/**
 * @route PATCH /tags/:id
 * @description Update a tag by ID.
 * @param {string} id - The ID of the tag to update.
 * @access Private (requires authentication)
 */
router.patch('/tags/:id', isAuthenticated, tagController.patchTag);

/**
 * @route DELETE /tags/:id
 * @description Delete a tag by ID.
 * @param {string} id - The ID of the tag to delete.
 * @access Private (requires authentication)
 */
router.delete('/tags/:id', isAuthenticated, tagController.deleteTag);

export default router;
