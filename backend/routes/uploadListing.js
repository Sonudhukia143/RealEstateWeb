import { Router } from "express";
import {uploadImg } from "../controllers/uploadListing.js";
import { upload } from "../cloudinary/cloudinaryConfig.js";

const router = Router();

router.post('/', upload.single('img')  , uploadImg);

export default router;