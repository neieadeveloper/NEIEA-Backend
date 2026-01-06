import express from 'express';
import { getOutOfSchoolDropoutPage } from '../controllers/outOfSchoolDropoutPageController.js';

const outOfSchoolDropoutPageRoutes = express.Router();

outOfSchoolDropoutPageRoutes.get('/', getOutOfSchoolDropoutPage);

export default outOfSchoolDropoutPageRoutes;


