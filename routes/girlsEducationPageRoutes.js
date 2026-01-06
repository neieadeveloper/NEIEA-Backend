import express from 'express';
import { getGirlsEducationPage } from '../controllers/girlsEducationPageController.js';

const girlsEducationPageRoutes = express.Router();

// Public route
girlsEducationPageRoutes.get('/', getGirlsEducationPage);

export default girlsEducationPageRoutes;

