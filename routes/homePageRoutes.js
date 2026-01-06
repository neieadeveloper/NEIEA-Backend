import express from 'express';
import { getHomePage } from '../controllers/homePageController.js';

const homePageRoutes = express.Router();

// Public route
homePageRoutes.get('/', getHomePage);

export default homePageRoutes;
