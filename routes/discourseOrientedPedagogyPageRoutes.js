import express from 'express';
import { getDOPPage } from '../controllers/discourseOrientedPedagogyPageController.js';

const router = express.Router();

// Public route - Get DOP page data
router.get('/', getDOPPage);

export default router;

