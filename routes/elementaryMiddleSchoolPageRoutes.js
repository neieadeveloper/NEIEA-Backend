import express from 'express';
import { getElementaryMiddleSchoolPage } from '../controllers/elementaryMiddleSchoolPageController.js';

const elementaryMiddleSchoolPageRoutes = express.Router();

// Public route
elementaryMiddleSchoolPageRoutes.get('/', getElementaryMiddleSchoolPage);

export default elementaryMiddleSchoolPageRoutes;

