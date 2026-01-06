import express from 'express';
import { getLeadershipPage } from '../controllers/leadershipPageController.js';

const leadershipPageRoutes = express.Router();

leadershipPageRoutes.get('/', getLeadershipPage);

export default leadershipPageRoutes;

