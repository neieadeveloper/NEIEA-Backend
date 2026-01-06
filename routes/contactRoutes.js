import express from 'express';
import { getContactInfo, submitContactForm } from '../controllers/contactController.js';

const contactRoutes = express.Router();

contactRoutes.get('/', getContactInfo);
contactRoutes.post('/contact-form', submitContactForm);

export default contactRoutes;