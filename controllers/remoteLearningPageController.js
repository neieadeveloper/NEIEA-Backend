import RemoteLearningPage from '../models/RemoteLearningPage.js';

// Get remote learning page data (Public)
export const getRemoteLearningPage = async (req, res) => {
  try {
    const remoteLearningPage = await RemoteLearningPage.findOne({ is_active: true })
      .select('-__v')
      .lean();
    
    if (!remoteLearningPage) {
      return res.status(404).json({
        success: false,
        message: 'Remote learning page data not found'
      });
    }
    
    // Sort courses by display_order, fallback to creation order if all have same order
    if (remoteLearningPage.coursesOfferedSection && remoteLearningPage.coursesOfferedSection.courses) {
      remoteLearningPage.coursesOfferedSection.courses.sort((a, b) => {
        const orderA = a.display_order || 0;
        const orderB = b.display_order || 0;
        
        // If both have same order (like 0), sort by _id to maintain consistent order
        if (orderA === orderB) {
          return a._id.toString().localeCompare(b._id.toString());
        }
        
        return orderA - orderB;
      });
    }
    
    // Sort pedagogical approaches by display_order, fallback to creation order if all have same order
    if (remoteLearningPage.pedagogicalApproachSection && remoteLearningPage.pedagogicalApproachSection.approaches) {
      remoteLearningPage.pedagogicalApproachSection.approaches.sort((a, b) => {
        const orderA = a.display_order || 0;
        const orderB = b.display_order || 0;
        
        // If both have same order (like 0), sort by _id to maintain consistent order
        if (orderA === orderB) {
          return a._id.toString().localeCompare(b._id.toString());
        }
        
        return orderA - orderB;
      });
    }
    
    res.status(200).json({
      success: true,
      data: remoteLearningPage
    });
  } catch (error) {
    console.error('Error fetching remote learning page:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch remote learning page data',
      error: error.message
    });
  }
};

// Get remote learning page data (Admin)
export const getRemoteLearningPageAdmin = async (req, res) => {
  try {
    const remoteLearningPage = await RemoteLearningPage.findOne({ is_active: true })
      .select('-__v')
      .lean();
    
    if (!remoteLearningPage) {
      return res.status(404).json({
        success: false,
        message: 'Remote learning page data not found'
      });
    }
    
    res.status(200).json({
      success: true,
      data: remoteLearningPage
    });
  } catch (error) {
    console.error('Error fetching remote learning page (admin):', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch remote learning page data',
      error: error.message
    });
  }
};

// Create remote learning page (Admin)
export const createRemoteLearningPage = async (req, res) => {
  try {
    const {
      headerSection,
      overviewSection,
      coursesOfferedSection,
      pedagogicalApproachSection,
      transformativeLearningSection,
      callToActionSection
    } = req.body;

    // Check if a remote learning page already exists
    const existingPage = await RemoteLearningPage.findOne({ is_active: true });
    if (existingPage) {
      return res.status(400).json({
        success: false,
        message: 'Remote learning page already exists. Use update endpoint instead.'
      });
    }

    const remoteLearningPage = new RemoteLearningPage({
      headerSection: {
        ...headerSection,
        shortDescription: headerSection?.shortDescription ?? ''
      },
      overviewSection,
      coursesOfferedSection,
      pedagogicalApproachSection,
      transformativeLearningSection,
      callToActionSection
    });

    await remoteLearningPage.save();

    res.status(201).json({
      success: true,
      message: 'Remote learning page created successfully',
      data: remoteLearningPage
    });
  } catch (error) {
    console.error('Error creating remote learning page:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to create remote learning page',
      error: error.message
    });
  }
};

// Update remote learning page (Admin)
export const updateRemoteLearningPage = async (req, res) => {
  try {
    const {
      headerSection,
      overviewSection,
      coursesOfferedSection,
      pedagogicalApproachSection,
      transformativeLearningSection,
      callToActionSection
    } = req.body;

    // Add display_order to courses based on their position in the array
    if (coursesOfferedSection && coursesOfferedSection.courses) {
      coursesOfferedSection.courses = coursesOfferedSection.courses.map((course, index) => ({
        ...course,
        display_order: index
      }));
    }

    // Add display_order to pedagogical approaches based on their position in the array
    if (pedagogicalApproachSection && pedagogicalApproachSection.approaches) {
      pedagogicalApproachSection.approaches = pedagogicalApproachSection.approaches.map((approach, index) => ({
        ...approach,
        display_order: index
      }));
    }

    if (headerSection && headerSection.shortDescription === undefined) {
      headerSection.shortDescription = '';
    }

    const updateData = {
      headerSection,
      overviewSection,
      coursesOfferedSection,
      pedagogicalApproachSection,
      transformativeLearningSection,
      callToActionSection
    };

    const remoteLearningPage = await RemoteLearningPage.findOneAndUpdate(
      { is_active: true },
      updateData,
      { new: true, runValidators: true }
    );

    if (!remoteLearningPage) {
      return res.status(404).json({
        success: false,
        message: 'Remote learning page not found'
      });
    }

    res.status(200).json({
      success: true,
      message: 'Remote learning page updated successfully',
      data: remoteLearningPage
    });
  } catch (error) {
    console.error('Error updating remote learning page:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update remote learning page',
      error: error.message
    });
  }
};

// Delete remote learning page (Admin)
export const deleteRemoteLearningPage = async (req, res) => {
  try {
    const remoteLearningPage = await RemoteLearningPage.findOneAndUpdate(
      { is_active: true },
      { is_active: false },
      { new: true }
    );

    if (!remoteLearningPage) {
      return res.status(404).json({
        success: false,
        message: 'Remote learning page not found'
      });
    }

    res.status(200).json({
      success: true,
      message: 'Remote learning page deleted successfully'
    });
  } catch (error) {
    console.error('Error deleting remote learning page:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to delete remote learning page',
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
