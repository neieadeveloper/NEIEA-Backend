import express from 'express';
import { getSocialEmbeds } from '../controllers/socialEmbedController.js';

const socialEmbedRoutes = express.Router();

// Public: fetch embeds by page/status
socialEmbedRoutes.get('/', getSocialEmbeds);

export default socialEmbedRoutes;
