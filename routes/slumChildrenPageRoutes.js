import express from 'express';
import { getSlumChildrenPage } from '../controllers/slumChildrenPageController.js';

const slumChildrenPageRoutes = express.Router();

// Public route
slumChildrenPageRoutes.get('/', getSlumChildrenPage);

export default slumChildrenPageRoutes;

