import express from 'express';
import { getIntroductionPage } from '../controllers/introductionPageController.js';

const introductionPageRoutes = express.Router();

// Public route
introductionPageRoutes.get('/', getIntroductionPage);

export default introductionPageRoutes;
