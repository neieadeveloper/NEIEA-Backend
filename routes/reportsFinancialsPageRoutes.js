import express from 'express';
import { getReportsFinancialsPage } from '../controllers/reportsFinancialsPageController.js';

const router = express.Router();

// Public route to get Reports & Financials page data
router.get('/', getReportsFinancialsPage);

export default router;

