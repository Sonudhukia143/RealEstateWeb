import { Router } from 'express';
import addInfo from '../controllers/addInfo.js';

const router = Router();

router.post('/', addInfo);

export default router;