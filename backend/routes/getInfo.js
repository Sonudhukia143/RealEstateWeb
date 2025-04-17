import fetchInfo from "../controllers/fetchInfo.js";
import { Router } from 'express';

const router = Router();

router.get('/:id', fetchInfo);

export default router;