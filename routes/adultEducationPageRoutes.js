import express from 'express';
import { getAdultEducationPage } from '../controllers/adultEducationPageController.js';

const adultEducationPageRoutes = express.Router();

adultEducationPageRoutes.get('/', getAdultEducationPage);

export default adultEducationPageRoutes;


