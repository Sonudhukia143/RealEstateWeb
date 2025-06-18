import { Router } from "express";
import { viewAllListings } from "../controllers/uploadListing.js";

const router = Router();

router.get('/', viewAllListings);

export default router;