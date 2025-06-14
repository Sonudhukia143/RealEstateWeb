import { Router } from "express";
import {addListing } from "../controllers/uploadListing.js";

const router = Router();

router.post('/', addListing);

export default router;