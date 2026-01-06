import express from 'express';
import { getApplicationOfTechnologyPage } from '../controllers/applicationOfTechnologyPageController.js';

const router = express.Router();

// Public route - Get Application of Technology page data
router.get('/', getApplicationOfTechnologyPage);

export default router;

