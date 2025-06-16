import { Router } from "express";
import { viewListingAdmin } from "../controllers/uploadListing.js";

const router = Router();

router.get('/', viewListingAdmin);

export default router;