import { Router } from 'express';
import verifyMail from '../controllers/verifyEmailController.js';

const router = Router();

router.get('/', verifyMail);

export default router;