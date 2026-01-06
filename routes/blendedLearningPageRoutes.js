import express from 'express';
import { getBlendedLearningPage } from '../controllers/blendedLearningPageController.js';

const blendedLearningPageRoutes = express.Router();

// Public route
blendedLearningPageRoutes.get('/', getBlendedLearningPage);

export default blendedLearningPageRoutes;

