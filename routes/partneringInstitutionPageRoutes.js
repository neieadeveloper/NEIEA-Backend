import express from 'express';
import {
  getPartneringInstitutionPage,
  getPartneringInstitutionPageAdmin,
  createPartneringInstitutionPage,
  updatePartneringInstitutionPage,
  deletePartneringInstitutionPage,
  uploadHeaderImage
} from '../controllers/partneringInstitutionPageController.js';
import { protect } from '../middleware/authMiddleware.js';
import { uploadPartneringInstitutionPageImage } from '../middleware/upload.js';

const partneringInstitutionPageRoutes = express.Router();

// Public route
partneringInstitutionPageRoutes.get('/', getPartneringInstitutionPage);

// Admin routes
partneringInstitutionPageRoutes.get('/admin', protect, getPartneringInstitutionPageAdmin);
partneringInstitutionPageRoutes.post('/admin', protect, createPartneringInstitutionPage);
partneringInstitutionPageRoutes.put('/admin', protect, updatePartneringInstitutionPage);
partneringInstitutionPageRoutes.delete('/admin', protect, deletePartneringInstitutionPage);
partneringInstitutionPageRoutes.post('/admin/upload-image', protect, uploadPartneringInstitutionPageImage, uploadHeaderImage);

export default partneringInstitutionPageRoutes;
