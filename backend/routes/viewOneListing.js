import { Router } from "express";
import { viewOneListing } from "../controllers/uploadListing.js";

const router = Router();

router.get('/:id', viewOneListing);

export default router;