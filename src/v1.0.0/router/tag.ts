import { Router } from 'express';
import * as tagController from '../controller/tag';
import { isAuthenticated } from '../middleware/auth';
const router = Router();

router.get('/tags', isAuthenticated, tagController.getTags);
router.get('/tags/:id', isAuthenticated, tagController.getTag);
router.post('/tags', isAuthenticated, tagController.postTag);
router.patch('/tags/:id', isAuthenticated, tagController.patchTag);
router.delete('/tags/:id', isAuthenticated, tagController.deletetag);

export default router;
