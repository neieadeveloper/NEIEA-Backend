import express from 'express';
import { getGlobalEducationPage } from '../controllers/globalEducationPageController.js';

const globalEducationPageRoutes = express.Router();

globalEducationPageRoutes.get('/', getGlobalEducationPage);

export default globalEducationPageRoutes;


