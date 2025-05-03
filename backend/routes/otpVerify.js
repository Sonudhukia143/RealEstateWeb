import { Router } from 'express';
import { verifyOtp } from '../controllers/otpVerificationController.js';

const router = Router();

router.post('/', verifyOtp);

export default router;