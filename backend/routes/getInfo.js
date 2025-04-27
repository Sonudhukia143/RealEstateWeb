import fetchInfo from "../controllers/fetchInfo.js";
import { Router } from 'express';

const router = Router();

router.get('/', fetchInfo);

export default router;