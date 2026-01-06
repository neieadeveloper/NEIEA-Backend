import validator from 'validator';
import LeadershipPage from '../models/LeadershipPage.js';
import { deleteSingleImageFromS3 } from '../utils/s3Cleanup.js';

const DEFAULT_HERO_SECTION = {
  title: 'Meet Our Team',
  description: 'Meet our team of dedicated leaders at NEIEA, a passionate group committed to empowering communities through innovative education and skill-building programs. With diverse backgrounds in teaching, administration, technology, and outreach, our team brings extensive experience and vision to every project.',
  heroImage: '/assets/images/banner-2.png'
};

const extractS3KeyFromUrl = (url) => {
  if (!url || !url.startsWith('http')) return null;

  try {
    const parsed = new URL(url);
    const pathname = parsed.pathname.startsWith('/') ? parsed.pathname.slice(1) : parsed.pathname;
    return decodeURIComponent(pathname);
  } catch (error) {
    const parts = url.split('/');
    if (parts.length < 2) return null;
    return parts.slice(-2).join('/');
  }
};

const sanitizeHeroSection = (heroSection = {}) => ({
  title: heroSection.title ? validator.escape(heroSection.title.trim()) : undefined,
  description: heroSection.description ? validator.escape(heroSection.description.trim()) : undefined,
  heroImage: heroSection.heroImage ? heroSection.heroImage.trim() : undefined
});

export const getLeadershipPage = async (req, res) => {
  try {
    const page = await LeadershipPage.findOne({ is_active: true })
      .select('-__v -createdAt -updatedAt')
      .lean();

    if (!page) {
      return res.status(200).json({
        success: true,
        data: { heroSection: DEFAULT_HERO_SECTION }
      });
    }

    return res.status(200).json({
      success: true,
      data: page
    });
  } catch (error) {
    console.error('Error fetching leadership page:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to fetch leadership page data',
      error: error.message
    });
  }
};

export const getLeadershipPageAdmin = async (req, res) => {
  try {
    const page = await LeadershipPage.findOne()
      .select('-__v')
      .lean();

    if (!page) {
      return res.status(404).json({
        success: false,
        message: 'Leadership page data not found'
      });
    }

    return res.status(200).json({
      success: true,
      data: page
    });
  } catch (error) {
    console.error('Error fetching leadership page for admin:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to fetch leadership page data',
      error: error.message
    });
  }
};

export const createLeadershipPage = async (req, res) => {
  try {
    const existingPage = await LeadershipPage.findOne();
    if (existingPage) {
      return res.status(400).json({
        success: false,
        message: 'Leadership page already exists. Please use the update endpoint instead.'
      });
    }

    const { heroSection } = req.body;

    if (!heroSection || !heroSection.title || !heroSection.description) {
      return res.status(400).json({
        success: false,
        message: 'Hero section title and description are required'
      });
    }

    const sanitizedHeroSection = sanitizeHeroSection(heroSection);

    const newPage = await LeadershipPage.create({
      heroSection: {
        title: sanitizedHeroSection.title || DEFAULT_HERO_SECTION.title,
        description: sanitizedHeroSection.description || DEFAULT_HERO_SECTION.description,
        heroImage: sanitizedHeroSection.heroImage || DEFAULT_HERO_SECTION.heroImage
      }
    });

    return res.status(201).json({
      success: true,
      message: 'Leadership page created successfully',
      data: newPage
    });
  } catch (error) {
    console.error('Error creating leadership page:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to create leadership page',
      error: error.message
    });
  }
};

export const updateLeadershipPage = async (req, res) => {
  try {
    const page = await LeadershipPage.findOne();

    if (!page) {
      return res.status(404).json({
        success: false,
        message: 'Leadership page data not found'
      });
    }

    const { heroSection } = req.body;

    if (!heroSection) {
      return res.status(400).json({
        success: false,
        message: 'Hero section payload is required'
      });
    }

    const sanitizedHeroSection = sanitizeHeroSection(heroSection);

    const updateData = {};

    if (sanitizedHeroSection.title !== undefined) {
      updateData['heroSection.title'] = sanitizedHeroSection.title || DEFAULT_HERO_SECTION.title;
    }

    if (sanitizedHeroSection.description !== undefined) {
      updateData['heroSection.description'] = sanitizedHeroSection.description || DEFAULT_HERO_SECTION.description;
    }

    if (sanitizedHeroSection.heroImage !== undefined) {
      updateData['heroSection.heroImage'] = sanitizedHeroSection.heroImage || DEFAULT_HERO_SECTION.heroImage;
    }

    if (Object.keys(updateData).length === 0) {
      return res.status(400).json({
        success: false,
        message: 'No valid fields provided for update'
      });
    }

    const updatedPage = await LeadershipPage.findByIdAndUpdate(
      page._id,
      { $set: updateData },
      { new: true, runValidators: true }
    );

    return res.status(200).json({
      success: true,
      message: 'Leadership page updated successfully',
      data: updatedPage
    });
  } catch (error) {
    console.error('Error updating leadership page:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to update leadership page',
      error: error.message
    });
  }
};

export const uploadLeadershipHeroImage = async (req, res) => {
  try {
    if (!req.file || !req.file.location) {
      return res.status(400).json({
        success: false,
        message: 'Image upload failed'
      });
    }

    const imageUrl = req.file.location;
    let page = await LeadershipPage.findOne();

    if (!page) {
      page = await LeadershipPage.create({
        heroSection: {
          ...DEFAULT_HERO_SECTION,
          heroImage: imageUrl
        }
      });
    } else {
      const existingImage = page.heroSection?.heroImage;
      const existingImageKey = extractS3KeyFromUrl(existingImage);

      if (existingImageKey) {
        await deleteSingleImageFromS3(existingImageKey);
      }

      page.heroSection.heroImage = imageUrl;
      await page.save();
    }

    return res.status(200).json({
      success: true,
      message: 'Hero image uploaded successfully',
      data: {
        image: imageUrl,
        heroSection: page.heroSection
      }
    });
  } catch (error) {
    console.error('Error uploading leadership hero image:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to upload hero image',
      error: error.message
    });
  }
};

