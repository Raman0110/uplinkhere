import { Router } from 'express';
import { createFileRequest } from '../controllers/FileRequestController';

const router = Router();

router.post('/', createFileRequest);

export default router;
