import DiscourseOrientedPedagogyPage from '../models/DiscourseOrientedPedagogyPage.js';

// ========================= IMAGE UPLOAD CONTROLLERS =========================

// Upload Hero Image
export const uploadHeroImage = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: 'No image file uploaded'
      });
    }

    const imageUrl = req.file.location; // S3 URL from multer-s3

    res.status(200).json({
      success: true,
      message: 'Hero image uploaded successfully',
      data: {
        imageUrl
      }
    });
  } catch (error) {
    console.error('Error uploading hero image:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to upload hero image',
      error: error.message
    });
  }
};

// Upload Introduction Image
export const uploadIntroductionImage = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: 'No image file uploaded'
      });
    }

    const imageUrl = req.file.location; // S3 URL from multer-s3

    res.status(200).json({
      success: true,
      message: 'Introduction image uploaded successfully',
      data: {
        imageUrl
      }
    });
  } catch (error) {
    console.error('Error uploading introduction image:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to upload introduction image',
      error: error.message
    });
  }
};

// Upload Founder Image
export const uploadFounderImage = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: 'No image file uploaded'
      });
    }

    const imageUrl = req.file.location; // S3 URL from multer-s3

    res.status(200).json({
      success: true,
      message: 'Founder image uploaded successfully',
      data: {
        imageUrl
      }
    });
  } catch (error) {
    console.error('Error uploading founder image:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to upload founder image',
      error: error.message
    });
  }
};

// Upload Feature Image
export const uploadFeatureImage = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: 'No image file uploaded'
      });
    }

    const imageUrl = req.file.location; // S3 URL from multer-s3

    res.status(200).json({
      success: true,
      message: 'Feature image uploaded successfully',
      data: {
        imageUrl
      }
    });
  } catch (error) {
    console.error('Error uploading feature image:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to upload feature image',
      error: error.message
    });
  }
};

// ========================= CRUD CONTROLLERS =========================

// Get DOP page data (Public)
export const getDOPPage = async (req, res) => {
  try {
    const dopPage = await DiscourseOrientedPedagogyPage.findOne({ is_active: true })
      .select('-__v')
      .lean();
    
    if (!dopPage) {
      return res.status(404).json({
        success: false,
        message: 'Discourse Oriented Pedagogy page data not found'
      });
    }
    
    // Sort features and resources by display_order
    if (dopPage.keyFeaturesSection && dopPage.keyFeaturesSection.features) {
      dopPage.keyFeaturesSection.features.sort((a, b) => {
        const orderA = a.display_order || 0;
        const orderB = b.display_order || 0;
        
        if (orderA === orderB) {
          return a._id.toString().localeCompare(b._id.toString());
        }
        
        return orderA - orderB;
      });
    }

    if (dopPage.additionalResourcesSection && dopPage.additionalResourcesSection.resources) {
      dopPage.additionalResourcesSection.resources.sort((a, b) => {
        const orderA = a.display_order || 0;
        const orderB = b.display_order || 0;
        
        if (orderA === orderB) {
          return a._id.toString().localeCompare(b._id.toString());
        }
        
        return orderA - orderB;
      });
    }
    
    res.status(200).json({
      success: true,
      data: dopPage
    });
  } catch (error) {
    console.error('Error fetching DOP page:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch Discourse Oriented Pedagogy page data',
      error: error.message
    });
  }
};

// Get DOP page data for admin (Admin)
export const getAdminDOPPage = async (req, res) => {
  try {
    const dopPage = await DiscourseOrientedPedagogyPage.findOne({ is_active: true })
      .select('-__v')
      .lean();
    
    if (!dopPage) {
      return res.status(404).json({
        success: false,
        message: 'Discourse Oriented Pedagogy page data not found'
      });
    }
    
    // Sort features and resources by display_order
    if (dopPage.keyFeaturesSection && dopPage.keyFeaturesSection.features) {
      dopPage.keyFeaturesSection.features.sort((a, b) => {
        const orderA = a.display_order || 0;
        const orderB = b.display_order || 0;
        
        if (orderA === orderB) {
          return a._id.toString().localeCompare(b._id.toString());
        }
        
        return orderA - orderB;
      });
    }

    if (dopPage.additionalResourcesSection && dopPage.additionalResourcesSection.resources) {
      dopPage.additionalResourcesSection.resources.sort((a, b) => {
        const orderA = a.display_order || 0;
        const orderB = b.display_order || 0;
        
        if (orderA === orderB) {
          return a._id.toString().localeCompare(b._id.toString());
        }
        
        return orderA - orderB;
      });
    }
    
    res.status(200).json({
      success: true,
      data: dopPage
    });
  } catch (error) {
    console.error('Error fetching admin DOP page:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch Discourse Oriented Pedagogy page data',
      error: error.message
    });
  }
};

// Create or Update DOP page (Admin)
export const createOrUpdateDOPPage = async (req, res) => {
  try {
    const dopData = req.body;
    
    // Find existing active page
    let dopPage = await DiscourseOrientedPedagogyPage.findOne({ is_active: true });
    
    if (dopPage) {
      // Update existing page
      Object.assign(dopPage, dopData);
      await dopPage.save();
      
      res.status(200).json({
        success: true,
        message: 'Discourse Oriented Pedagogy page updated successfully',
        data: dopPage
      });
    } else {
      // Create new page
      dopPage = new DiscourseOrientedPedagogyPage(dopData);
      await dopPage.save();
      
      res.status(201).json({
        success: true,
        message: 'Discourse Oriented Pedagogy page created successfully',
        data: dopPage
      });
    }
  } catch (error) {
    console.error('Error creating/updating DOP page:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to save Discourse Oriented Pedagogy page data',
      error: error.message
    });
  }
};

// Update DOP page (Admin) - Alternative PUT method
export const updateDOPPage = async (req, res) => {
  try {
    const dopData = req.body;
    
    // Find existing active page
    const dopPage = await DiscourseOrientedPedagogyPage.findOne({ is_active: true });
    
    if (!dopPage) {
      return res.status(404).json({
        success: false,
        message: 'Discourse Oriented Pedagogy page not found'
      });
    }
    
    // Update page
    Object.assign(dopPage, dopData);
    await dopPage.save();
    
    res.status(200).json({
      success: true,
      message: 'Discourse Oriented Pedagogy page updated successfully',
      data: dopPage
    });
  } catch (error) {
    console.error('Error updating DOP page:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update Discourse Oriented Pedagogy page data',
      error: error.message
    });
  }
};

