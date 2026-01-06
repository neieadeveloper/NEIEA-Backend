import express from 'express';
import { getMadrasaPage } from '../controllers/madrasaPageController.js';

const madrasaPageRoutes = express.Router();

madrasaPageRoutes.get('/', getMadrasaPage);

export default madrasaPageRoutes;


