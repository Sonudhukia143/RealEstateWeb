import { Router } from 'express';
import loginUser from '../controllers/logInController.js';

const router = Router();

router.post('/', loginUser);

export default router;