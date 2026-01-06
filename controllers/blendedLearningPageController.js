import BlendedLearningPage from '../models/BlendedLearningPage.js';

// Get blended learning page data (Public)
export const getBlendedLearningPage = async (req, res) => {
  try {
    const blendedLearningPage = await BlendedLearningPage.findOne({ is_active: true })
      .select('-__v')
      .lean();
    
    if (!blendedLearningPage) {
      return res.status(404).json({
        success: false,
        message: 'Blended learning page data not found'
      });
    }
    
    res.status(200).json({
      success: true,
      data: blendedLearningPage
    });
  } catch (error) {
    console.error('Error fetching blended learning page:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch blended learning page data',
      error: error.message
    });
  }
};

// Get blended learning page data (Admin)
export const getBlendedLearningPageAdmin = async (req, res) => {
  try {
    const blendedLearningPage = await BlendedLearningPage.findOne({ is_active: true })
      .select('-__v')
      .lean();
    
    if (!blendedLearningPage) {
      return res.status(404).json({
        success: false,
        message: 'Blended learning page data not found'
      });
    }
    
    res.status(200).json({
      success: true,
      data: blendedLearningPage
    });
  } catch (error) {
    console.error('Error fetching blended learning page (admin):', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch blended learning page data',
      error: error.message
    });
  }
};

// Create blended learning page (Admin)
export const createBlendedLearningPage = async (req, res) => {
  try {
    const {
      headerSection,
      overviewSection
    } = req.body;

    // Validation
    if (!headerSection || !overviewSection) {
      return res.status(400).json({
        success: false,
        message: 'All sections are required'
      });
    }

    // Check if blended learning page already exists
    const existingPage = await BlendedLearningPage.findOne();
    if (existingPage) {
      return res.status(400).json({
        success: false,
        message: 'Blended learning page already exists. Use update endpoint instead.'
      });
    }

    // Create new blended learning page
    const newBlendedLearningPage = new BlendedLearningPage({
      headerSection,
      overviewSection
    });

    await newBlendedLearningPage.save();

    res.status(201).json({
      success: true,
      message: 'Blended learning page created successfully',
      data: newBlendedLearningPage
    });
  } catch (error) {
    console.error('Error creating blended learning page:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to create blended learning page',
      error: error.message
    });
  }
};

// Update blended learning page (Admin)
export const updateBlendedLearningPage = async (req, res) => {
  try {
    const {
      headerSection,
      overviewSection
    } = req.body;

    // Find and update the active blended learning page
    const blendedLearningPage = await BlendedLearningPage.findOneAndUpdate(
      { is_active: true },
      {
        $set: {
          headerSection,
          overviewSection
        }
      },
      {
        new: true,
        runValidators: true
      }
    );

    if (!blendedLearningPage) {
      return res.status(404).json({
        success: false,
        message: 'Blended learning page not found. Create one first.'
      });
    }

    res.status(200).json({
      success: true,
      message: 'Blended learning page updated successfully',
      data: blendedLearningPage
    });
  } catch (error) {
    console.error('Error updating blended learning page:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update blended learning page',
      error: error.message
    });
  }
};

// Delete blended learning page (Admin)
export const deleteBlendedLearningPage = async (req, res) => {
  try {
    const blendedLearningPage = await BlendedLearningPage.findOne({ is_active: true });
    
    if (!blendedLearningPage) {
      return res.status(404).json({
        success: false,
        message: 'Blended learning page not found'
      });
    }

    await BlendedLearningPage.findByIdAndDelete(blendedLearningPage._id);

    res.status(200).json({
      success: true,
      message: 'Blended learning page deleted successfully'
    });
  } catch (error) {
    console.error('Error deleting blended learning page:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to delete blended learning page',
      error: error.message
    });
  }
};

// Upload header image (Admin)
export const uploadHeaderImage = async (req, res) => {
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
      message: 'Header image uploaded successfully',
      data: {
        imageUrl
      }
    });
  } catch (error) {
    console.error('Error uploading header image:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to upload header image',
      error: error.message
    });
  }
};

// Upload supporting image (Admin)
export const uploadSupportingImage = async (req, res) => {
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
      message: 'Supporting image uploaded successfully',
      data: {
        imageUrl
      }
    });
  } catch (error) {
    console.error('Error uploading supporting image:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to upload supporting image',
      error: error.message
    });
  }
};
