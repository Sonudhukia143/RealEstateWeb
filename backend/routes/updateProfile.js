import { Router } from 'express';
import updateProfile from '../controllers/editProfile.js';
import { upload } from '../cloudinary/cloudinaryConfig.js';

const router = Router();

router.post('/',upload.single('img') , updateProfile);

export default router;