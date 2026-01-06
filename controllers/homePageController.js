import HomePage from '../models/HomePage.js';
import ErrorResponse from '../utils/errorResponse.js';

// Get homepage data (Public)
export const getHomePage = async (req, res) => {
  try {
    const homePage = await HomePage.findOne({ is_active: true })
      .select('-__v')
      .lean();
    
    if (!homePage) {
      return res.status(404).json({
        success: false,
        message: 'Homepage data not found'
      });
    }
    
    // Sort slides, programs, and statistics by display_order
    if (homePage.banner && homePage.banner.slides) {
      homePage.banner.slides.sort((a, b) => {
        const orderA = a.display_order || 0;
        const orderB = b.display_order || 0;
        return orderA - orderB;
      });
    }
    
    if (homePage.globalPrograms && homePage.globalPrograms.programs) {
      homePage.globalPrograms.programs.sort((a, b) => {
        const orderA = a.display_order || 0;
        const orderB = b.display_order || 0;
        return orderA - orderB;
      });
    }
    
    if (homePage.statistics && homePage.statistics.statistics) {
      homePage.statistics.statistics.sort((a, b) => {
        const orderA = a.display_order || 0;
        const orderB = b.display_order || 0;
        return orderA - orderB;
      });
    }

    if (homePage.testimonials) {
      homePage.testimonials.heading =
        (homePage.testimonials.heading && homePage.testimonials.heading.trim() !== '')
          ? homePage.testimonials.heading
          : 'Testimonials';
    }
    
    res.status(200).json({
      success: true,
      data: homePage
    });
  } catch (error) {
    console.error('Error fetching homepage:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch homepage data',
      error: error.message
    });
  }
};

// Admin: Get homepage data for editing
export const getHomePageForAdmin = async (req, res) => {
  try {
    const homePage = await HomePage.findOne({ is_active: true })
      .select('-__v')
      .lean();
    
    if (!homePage) {
      return res.status(404).json({
        success: false,
        message: 'Homepage data not found'
      });
    }

    if (homePage.testimonials) {
      homePage.testimonials.heading =
        (homePage.testimonials.heading && homePage.testimonials.heading.trim() !== '')
          ? homePage.testimonials.heading
          : 'Testimonials';
    }
    
    res.status(200).json({
      success: true,
      data: homePage
    });
  } catch (error) {
    console.error('Error fetching homepage for admin:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch homepage data',
      error: error.message
    });
  }
};

// Admin: Create or update homepage
export const createOrUpdateHomePage = async (req, res) => {
  try {
    const {
      banner,
      ourMission,
      videoSection,
      globalPrograms,
      statistics,
      testimonials
    } = req.body;

    // Check if homepage already exists
    let homePage = await HomePage.findOne({ is_active: true });

    if (homePage) {
      // Update existing homepage
      homePage.banner = banner || homePage.banner;
      homePage.ourMission = ourMission || homePage.ourMission;
      homePage.videoSection = videoSection || homePage.videoSection;
      homePage.globalPrograms = globalPrograms || homePage.globalPrograms;
      homePage.statistics = statistics || homePage.statistics;
      homePage.testimonials = testimonials || homePage.testimonials;
      
      await homePage.save();
      
      res.status(200).json({
        success: true,
        message: 'Homepage updated successfully',
        data: homePage
      });
    } else {
      // Create new homepage
      homePage = new HomePage({
        banner,
        ourMission,
        videoSection,
        globalPrograms,
        statistics,
        testimonials
      });
      
      await homePage.save();
      
      res.status(201).json({
        success: true,
        message: 'Homepage created successfully',
        data: homePage
      });
    }
  } catch (error) {
    console.error('Error creating/updating homepage:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to create/update homepage',
      error: error.message
    });
  }
};

// Admin: Upload banner slides
export const uploadBannerSlides = async (req, res) => {
  try {
    if (!req.files || req.files.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'No images uploaded'
      });
    }

    const slides = req.files.map((file, index) => ({
      image: file.location,
      alt: req.body.altTexts && req.body.altTexts[index] ? req.body.altTexts[index] : `Banner slide ${index + 1}`,
      display_order: index
    }));

    let homePage = await HomePage.findOne({ is_active: true });

    if (!homePage) {
      // Create new homepage if it doesn't exist
      homePage = new HomePage({
        banner: { slides: [], is_active: true },
        ourMission: { is_active: true },
        innovationSection: { is_active: true },
        globalPrograms: { is_active: true },
        statistics: { is_active: true },
        testimonials: { is_active: true },
        is_active: true
      });
    }

    homePage.banner = {
      slides: slides,
      is_active: true
    };

    await homePage.save();

    res.status(200).json({
      success: true,
      message: 'Banner slides uploaded successfully',
      data: homePage.banner
    });
  } catch (error) {
    console.error('Error uploading banner slides:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to upload banner slides',
      error: error.message
    });
  }
};

// Admin: Update banner section (for backward compatibility with URL-based updates)
export const updateBannerSection = async (req, res) => {
  try {
    const { slides } = req.body;

    let homePage = await HomePage.findOne({ is_active: true });

    if (!homePage) {
      return res.status(404).json({
        success: false,
        message: 'Homepage not found'
      });
    }

    homePage.banner = {
      slides: slides || [],
      is_active: true
    };

    await homePage.save();

    res.status(200).json({
      success: true,
      message: 'Banner section updated successfully',
      data: homePage.banner
    });
  } catch (error) {
    console.error('Error updating banner section:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update banner section',
      error: error.message
    });
  }
};

// Admin: Upload Our Mission section image
export const uploadOurMissionImage = async (req, res) => {
  try {
    if (!req.file || !req.file.location) {
      return res.status(400).json({
        success: false,
        message: 'No image file uploaded'
      });
    }

    const imageUrl = req.file.location;

    res.status(200).json({
      success: true,
      message: 'Our Mission image uploaded successfully',
      data: {
        imageUrl: imageUrl
      }
    });
  } catch (error) {
    console.error('Error uploading our mission image:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to upload our mission image',
      error: error.message
    });
  }
};

// Admin: Upload Leadership section image (under Our Mission)
export const uploadLeadershipImage = async (req, res) => {
  try {
    if (!req.file || !req.file.location) {
      return res.status(400).json({
        success: false,
        message: 'No image file uploaded'
      });
    }

    const imageUrl = req.file.location;

    res.status(200).json({
      success: true,
      message: 'Leadership image uploaded successfully',
      data: {
        imageUrl: imageUrl
      }
    });
  } catch (error) {
    console.error('Error uploading leadership image:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to upload leadership image',
      error: error.message
    });
  }
};

// Admin: Update our mission section
export const updateOurMissionSection = async (req, res) => {
  try {
    const { mission, vision, leadership } = req.body;

    let homePage = await HomePage.findOne({ is_active: true });

    if (!homePage) {
      return res.status(404).json({
        success: false,
        message: 'Homepage not found'
      });
    }

    homePage.ourMission = {
      mission: mission || homePage.ourMission?.mission,
      vision: vision || homePage.ourMission?.vision,
      leadership: leadership || homePage.ourMission?.leadership,
      is_active: true
    };

    await homePage.save();

    res.status(200).json({
      success: true,
      message: 'Our Mission section updated successfully',
      data: homePage.ourMission
    });
  } catch (error) {
    console.error('Error updating our mission section:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update our mission section',
      error: error.message
    });
  }
};

// Admin: Upload Innovation section image
export const uploadInnovationImage = async (req, res) => {
  try {
    if (!req.file || !req.file.location) {
      return res.status(400).json({
        success: false,
        message: 'No image file uploaded'
      });
    }

    const imageUrl = req.file.location;

    res.status(200).json({
      success: true,
      message: 'Innovation image uploaded successfully',
      data: {
        imageUrl: imageUrl
      }
    });
  } catch (error) {
    console.error('Error uploading innovation image:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to upload innovation image',
      error: error.message
    });
  }
};

// Admin: Update innovation section
export const updateInnovationSection = async (req, res) => {
  try {
    const { title, description, image, buttonText, buttonLink } = req.body;

    let homePage = await HomePage.findOne({ is_active: true });

    if (!homePage) {
      return res.status(404).json({
        success: false,
        message: 'Homepage not found'
      });
    }

    // Validate required fields (image can come from upload or URL)
    if (!title || !description || !image || !buttonText || !buttonLink) {
      return res.status(400).json({
        success: false,
        message: 'All fields are required for innovation section'
      });
    }

    homePage.innovationSection = {
      title,
      description,
      image,
      buttonText,
      buttonLink,
      is_active: true
    };

    await homePage.save();

    res.status(200).json({
      success: true,
      message: 'Innovation section updated successfully',
      data: homePage.innovationSection
    });
  } catch (error) {
    console.error('Error updating innovation section:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update innovation section',
      error: error.message
    });
  }
};

// Admin: Upload Global Programs section image
export const uploadGlobalProgramsImage = async (req, res) => {
  try {
    if (!req.file || !req.file.location) {
      return res.status(400).json({
        success: false,
        message: 'No image file uploaded'
      });
    }

    const imageUrl = req.file.location;

    res.status(200).json({
      success: true,
      message: 'Global Programs image uploaded successfully',
      data: {
        imageUrl: imageUrl
      }
    });
  } catch (error) {
    console.error('Error uploading global programs image:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to upload global programs image',
      error: error.message
    });
  }
};

// Admin: Update global programs section
export const updateGlobalProgramsSection = async (req, res) => {
  try {
    const { title1, description1, title2, description2, image, buttonText, buttonLink } = req.body;

    let homePage = await HomePage.findOne({ is_active: true });

    if (!homePage) {
      return res.status(404).json({
        success: false,
        message: 'Homepage not found'
      });
    }

    homePage.globalPrograms = {
      title1: title1 || homePage.globalPrograms?.title1,
      description1: description1 || homePage.globalPrograms?.description1,
      title2: title2 || homePage.globalPrograms?.title2,
      description2: description2 || homePage.globalPrograms?.description2,
      image: image || homePage.globalPrograms?.image,
      buttonText: buttonText || homePage.globalPrograms?.buttonText,
      buttonLink: buttonLink || homePage.globalPrograms?.buttonLink,
      is_active: true
    };

    await homePage.save();

    res.status(200).json({
      success: true,
      message: 'Global Programs section updated successfully',
      data: homePage.globalPrograms
    });
  } catch (error) {
    console.error('Error updating global programs section:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update global programs section',
      error: error.message
    });
  }
};

// Admin: Update statistics section
export const updateStatisticsSection = async (req, res) => {
  try {
    const { heading, statistics: stats, backgroundImage } = req.body;

    let homePage = await HomePage.findOne({ is_active: true });

    if (!homePage) {
      return res.status(404).json({
        success: false,
        message: 'Homepage not found'
      });
    }

    homePage.statistics = {
      heading: heading || homePage.statistics?.heading,
      backgroundImage: backgroundImage !== undefined
        ? backgroundImage
        : homePage.statistics?.backgroundImage || '',
      statistics: stats || homePage.statistics?.statistics || [],
      is_active: true
    };

    await homePage.save();

    res.status(200).json({
      success: true,
      message: 'Statistics section updated successfully',
      data: homePage.statistics
    });
  } catch (error) {
    console.error('Error updating statistics section:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update statistics section',
      error: error.message
    });
  }
};

export const uploadStatisticsBackgroundImage = async (req, res) => {
  try {
    if (!req.file || !req.file.location) {
      return res.status(400).json({
        success: false,
        message: 'No image file uploaded'
      });
    }

    res.status(200).json({
      success: true,
      message: 'Statistics background image uploaded successfully',
      data: {
        imageUrl: req.file.location
      }
    });
  } catch (error) {
    console.error('Error uploading statistics background image:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to upload statistics background image',
      error: error.message
    });
  }
};

// Admin: Upload Testimonial image
export const uploadTestimonialImage = async (req, res) => {
  try {
    if (!req.file || !req.file.location) {
      return res.status(400).json({
        success: false,
        message: 'No image file uploaded'
      });
    }

    const imageUrl = req.file.location;

    res.status(200).json({
      success: true,
      message: 'Testimonial image uploaded successfully',
      data: {
        imageUrl: imageUrl
      }
    });
  } catch (error) {
    console.error('Error uploading testimonial image:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to upload testimonial image',
      error: error.message
    });
  }
};

// Admin: Update testimonials section
export const updateTestimonialsSection = async (req, res) => {
  try {
    const { heading, testimonials } = req.body;

    // Validate required fields
    if (!testimonials || !Array.isArray(testimonials)) {
      return res.status(400).json({
        success: false,
        message: 'Testimonials array is required'
      });
    }

    // Validate each testimonial
    for (const testimonial of testimonials) {
      if (!testimonial.name || !testimonial.testimonial || !testimonial.quoteIcon) {
        return res.status(400).json({
          success: false,
          message: 'Each testimonial must have name, testimonial text, and quote icon'
        });
      }
      
      // For image testimonials, image is required
      if (!testimonial.isVideo && (!testimonial.image || testimonial.image.trim() === '')) {
        return res.status(400).json({
          success: false,
          message: 'Image testimonials must have an image URL'
        });
      }
      
      // For video testimonials, videoUrl is required
      if (testimonial.isVideo && (!testimonial.videoUrl || testimonial.videoUrl.trim() === '')) {
        return res.status(400).json({
          success: false,
          message: 'Video testimonials must have a video URL'
        });
      }
    }

    let homePage = await HomePage.findOne({ is_active: true });

    if (!homePage) {
      return res.status(404).json({
        success: false,
        message: 'Homepage not found'
      });
    }

    let sanitizedHeading = homePage.testimonials?.heading || 'Testimonials';
    if (typeof heading === 'string' && heading.trim() !== '') {
      sanitizedHeading = heading.trim();
    }

    homePage.testimonials = {
      heading: sanitizedHeading,
      testimonials,
      is_active: true
    };

    await homePage.save();

    res.status(200).json({
      success: true,
      message: 'Testimonials section updated successfully',
      data: homePage.testimonials
    });
  } catch (error) {
    console.error('Error updating testimonials section:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update testimonials section',
      error: error.message
    });
  }
};

// Admin: Delete homepage
export const deleteHomePage = async (req, res) => {
  try {
    const homePage = await HomePage.findOne({ is_active: true });

    if (!homePage) {
      return res.status(404).json({
        success: false,
        message: 'Homepage not found'
      });
    }

    homePage.is_active = false;
    await homePage.save();

    res.status(200).json({
      success: true,
      message: 'Homepage deleted successfully'
    });
  } catch (error) {
    console.error('Error deleting homepage:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to delete homepage',
      error: error.message
    });
  }
};
