import express from 'express';
import { getNeiUsaIntroductionPage } from '../controllers/neiUsaIntroductionPageController.js';

const neiUsaIntroductionPageRoutes = express.Router();

// Public route
neiUsaIntroductionPageRoutes.get('/', getNeiUsaIntroductionPage);

export default neiUsaIntroductionPageRoutes;

