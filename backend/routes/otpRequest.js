import { Router } from 'express';
import {sendOtp} from "../controllers/otpVerificationController.js";

const router = Router();

router.post('/', sendOtp);

export default router;