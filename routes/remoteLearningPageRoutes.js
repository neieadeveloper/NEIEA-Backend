import express from 'express';
import { getRemoteLearningPage } from '../controllers/remoteLearningPageController.js';

const remoteLearningPageRoutes = express.Router();

// Public route
remoteLearningPageRoutes.get('/', getRemoteLearningPage);

export default remoteLearningPageRoutes;

