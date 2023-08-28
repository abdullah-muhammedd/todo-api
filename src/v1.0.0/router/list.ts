import { Router } from 'express';
import * as listController from '../controller/list';
import { isAuthenticated } from '../middleware/auth';
const router = Router();

router.get('/lists', isAuthenticated, listController.getLists);
router.get('/lists/:id', isAuthenticated, listController.getList);
router.post('/lists', isAuthenticated, listController.postList);
router.patch('/lists/:id', isAuthenticated, listController.patchList);
router.delete('/lists/:id', isAuthenticated, listController.deleteList);

export default router;
