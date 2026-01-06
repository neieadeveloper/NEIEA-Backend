import express from 'express';
import { getPrivacyPolicyPage } from '../controllers/privacyPolicyPageController.js';

const privacyPolicyPageRoutes = express.Router();

privacyPolicyPageRoutes.get('/', getPrivacyPolicyPage);

export default privacyPolicyPageRoutes;


