import { Router } from "express";
import { initialFetch } from "../controllers/uploadListing.js";

const router = Router();

router.get('/', initialFetch);

export default router;