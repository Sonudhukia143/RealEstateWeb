import { Router } from 'express';
import requestVerification from '../controllers/requestVerification.js';

const router = Router();

router.post('/', requestVerification);

export default router;