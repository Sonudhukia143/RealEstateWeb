import { Router } from 'express';
import { deleteListing } from '../controllers/uploadListing.js';

const router = Router();

router.delete('/:id', deleteListing);

export default router;