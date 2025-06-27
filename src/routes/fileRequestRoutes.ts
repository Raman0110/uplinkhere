import { Router } from 'express';
import { checkRequestExpiration, checkRequestPassword, createFileRequest, getFileRequestsFromSlug, getUserFileRequest } from '../controllers/FileRequestController';
import { requireAuth } from '../middleware/requireAuth';

const router = Router();

router.post('/', requireAuth, createFileRequest);
router.get('/getFileRequests', requireAuth, getUserFileRequest);
router.get('/getFileRequestsFromSlug/:slug', getFileRequestsFromSlug);
router.post('/checkRequestPassword', checkRequestPassword);
router.post('/checkRequestExpiration', checkRequestExpiration);

export default router;
