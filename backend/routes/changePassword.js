import changePassword from "../controllers/changePassword.js";
import { Router } from 'express';

const router = Router();

router.post('/', changePassword);

export default router;