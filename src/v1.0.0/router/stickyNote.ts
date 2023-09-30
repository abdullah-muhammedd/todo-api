import { Router } from 'express';
import * as stickyController from '../controller/stickyNote';
import { isAuthenticated } from '../middleware/auth';

const router = Router();

/**
 * @route GET /notes
 * @description Get a list of sticky notes.
 * @access Private (requires authentication)
 */
router.get('/notes', isAuthenticated, stickyController.getStickyNotes);

/**
 * @route GET /notes/count
 * @description get number of notes
 * @access Private (requires authentication)
 */
router.get('/notes/count', isAuthenticated, stickyController.countNotes);

/**
 * @route GET /notes/:id
 * @description Get a sticky note by ID.
 * @param {string} id - The ID of the sticky note.
 * @access Private (requires authentication)
 */
router.get('/notes/:id', isAuthenticated, stickyController.getStickyNote);

/**
 * @route POST /notes
 * @description Create a new sticky note.
 * @access Private (requires authentication)
 */
router.post('/notes', isAuthenticated, stickyController.postStickyNote);

/**
 * @route PATCH /notes/:id
 * @description Update a sticky note by ID.
 * @param {string} id - The ID of the sticky note to update.
 * @access Private (requires authentication)
 */
router.patch('/notes/:id', isAuthenticated, stickyController.patchStickyNote);

/**
 * @route DELETE /notes/:id
 * @description Delete a sticky note by ID.
 * @param {string} id - The ID of the sticky note to delete.
 * @access Private (requires authentication)
 */
router.delete('/notes/:id', isAuthenticated, stickyController.deleteStickyNote);

export default router;
