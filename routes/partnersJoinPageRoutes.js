import express from 'express';
import { protect } from '../middleware/authMiddleware.js';
import {
  getPartnersJoinPage,
  getPartnersJoinPageAdmin,
  createOrUpdatePartnersJoinPage,
  updatePartnersJoinPage,
  uploadHeaderImage,
  uploadCharitiesSymbolicImage,
} from '../controllers/partnersJoinPageController.js';
import { uploadPartnersJoinHeaderImage, uploadPartnersJoinSymbolicImage } from '../middleware/upload.js';

const partnersJoinPageRoutes = express.Router();

// Public
partnersJoinPageRoutes.get('/', getPartnersJoinPage);

// Admin
partnersJoinPageRoutes.get('/admin', protect, getPartnersJoinPageAdmin);
partnersJoinPageRoutes.post('/admin', protect, createOrUpdatePartnersJoinPage);
partnersJoinPageRoutes.put('/admin', protect, updatePartnersJoinPage);
partnersJoinPageRoutes.post('/admin/upload-header-image', protect, uploadPartnersJoinHeaderImage, uploadHeaderImage);
partnersJoinPageRoutes.post('/admin/upload-symbolic-image', protect, uploadPartnersJoinSymbolicImage, uploadCharitiesSymbolicImage);

export default partnersJoinPageRoutes;


