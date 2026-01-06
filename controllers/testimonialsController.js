import { CardTestimonial, VideoTestimonial, FeaturedStory } from '../models/Testimonial.js';

// CARD TESTIMONIALS
export const getAllCardTestimonials = async (req, res) => {
  try {
    const testimonials = await CardTestimonial.find({ is_active: true })
      .sort({ display_order: 1, createdAt: -1 });
    res.json(testimonials);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch card testimonials' });
  }
};

// VIDEO TESTIMONIALS
export const getAllVideoTestimonials = async (req, res) => {
  try {
    const testimonials = await VideoTestimonial.find({ is_active: true })
      .sort({ display_order: 1, createdAt: -1 });
    res.json(testimonials);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch video testimonials' });
  }
};

// FEATURED STORIES (Public)
export const getAllFeaturedStories = async (req, res) => {
  try {
    const stories = await FeaturedStory.find({ is_active: true })
      .sort({ display_order: 1, createdAt: -1 });
    res.json(stories);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch featured stories' });
  }
};