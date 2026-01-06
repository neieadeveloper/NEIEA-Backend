import express from 'express';
import {
    getAllCardTestimonials,
    getAllVideoTestimonials,
    getAllFeaturedStories,
} from '../controllers/testimonialsController.js';

const testimonialsRoutes = express.Router();

// Card Testimonials
testimonialsRoutes.get('/cards', getAllCardTestimonials);;

// Video Testimonials
testimonialsRoutes.get('/videos', getAllVideoTestimonials);

// Featured Stories
testimonialsRoutes.get('/featured-stories', getAllFeaturedStories);

export default testimonialsRoutes;