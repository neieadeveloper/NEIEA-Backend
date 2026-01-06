import express from 'express';
import { getTechnicalSkillTrainingPage } from '../controllers/TechnicalSkillTrainingController.js';

const technicalSkillTrainingRoutes = express.Router();

technicalSkillTrainingRoutes.get('/', getTechnicalSkillTrainingPage);

export default technicalSkillTrainingRoutes;


