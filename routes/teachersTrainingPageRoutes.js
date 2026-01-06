import express from 'express';
import { getTeachersTrainingPage } from '../controllers/teachersTrainingPageController.js';

const teachersTrainingPageRoutes = express.Router();

teachersTrainingPageRoutes.get('/', getTeachersTrainingPage);

export default teachersTrainingPageRoutes;


