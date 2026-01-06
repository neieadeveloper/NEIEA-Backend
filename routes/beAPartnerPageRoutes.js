import express from 'express';
import { getBeAPartnerPage } from '../controllers/beAPartnerPageController.js';

const beAPartnerPageRoutes = express.Router();

beAPartnerPageRoutes.get('/', getBeAPartnerPage);

export default beAPartnerPageRoutes;


