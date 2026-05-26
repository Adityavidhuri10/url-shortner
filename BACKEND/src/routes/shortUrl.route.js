import express from 'express';
import { createShortUrl, getUserUrls, deleteUrl } from '../controller/shortUrl.controller.js';
import { verifyJWT } from '../Middlewares/auth.middleware.js';

const router = express.Router();

router.post('/', createShortUrl);
router.get('/', verifyJWT, getUserUrls);
router.delete('/:id', verifyJWT, deleteUrl);

export default router;