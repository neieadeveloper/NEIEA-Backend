import express from 'express';
import { getPublicGovernmentSchoolPage } from '../controllers/publicGovernmentSchoolPageController.js';

const publicGovernmentSchoolPageRoutes = express.Router();

// Public route
publicGovernmentSchoolPageRoutes.get('/', getPublicGovernmentSchoolPage);

export default publicGovernmentSchoolPageRoutes;
