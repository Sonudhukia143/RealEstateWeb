import { Router } from 'express';
import signupuser from '../controllers/signUpController.js';
import { upload } from '../cloudinary/cloudinaryConfig.js';

const router = Router();

router.post('/',upload.single('img') , signupuser);

export default router;