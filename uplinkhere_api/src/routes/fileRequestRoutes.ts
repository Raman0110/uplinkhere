import { Router } from 'express';
import { checkRequestExpiration, checkRequestPassword, createFileRequest, deleteFileRequest, getFileRequestsFromSlug, getOwnedFileRequest, getUserFileRequest } from '../controllers/FileRequestController';
import { requireAuth } from '../middleware/requireAuth';

const router = Router();

router.post('/', requireAuth, createFileRequest);
router.get('/getFileRequests', requireAuth, getUserFileRequest);
router.get('/getFileRequestsFromSlug/:slug', getFileRequestsFromSlug);
router.get('/manage/:slug', requireAuth, getOwnedFileRequest);
router.post('/checkRequestPassword', checkRequestPassword);
router.post('/checkRequestExpiration', checkRequestExpiration);
router.delete('/:slug', requireAuth, deleteFileRequest);

export default router;
