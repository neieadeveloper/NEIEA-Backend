import express from 'express';
import { getSoftSkillTrainingPage } from '../controllers/softSkillTrainingPageController.js';

const softSkillTrainingPageRoutes = express.Router();

// Public route
softSkillTrainingPageRoutes.get('/', getSoftSkillTrainingPage);

export default softSkillTrainingPageRoutes;


