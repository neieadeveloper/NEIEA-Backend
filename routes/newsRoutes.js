import express from 'express';
import {
    createNews,
    getAllNews,
    updateNews,
    deleteNews,
    uploadNewsImage
} from '../controllers/newsController.js';
import { uploadNewsImage as uploadNewsImageMiddleware } from '../middleware/upload.js';

const router = express.Router();

router.post('/', createNews);
router.get('/', getAllNews);
router.put('/:id', updateNews);
router.delete('/:id', deleteNews);

// News image upload route
router.post('/upload-image', uploadNewsImageMiddleware, uploadNewsImage);

export default router;

