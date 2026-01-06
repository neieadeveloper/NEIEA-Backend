import ApplicationOfTechnologyPage from '../models/ApplicationOfTechnologyPage.js';

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

// Upload Digital Classroom Image
export const uploadDigitalClassroomImage = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: 'No image file uploaded'
      });
    }

    const imageUrl = req.file.location;

    res.status(200).json({
      success: true,
      message: 'Digital classroom image uploaded successfully',
      data: {
        imageUrl
      }
    });
  } catch (error) {
    console.error('Error uploading digital classroom image:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to upload digital classroom image',
      error: error.message
    });
  }
};

// Upload Onboarding Image
export const uploadOnboardingImage = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: 'No image file uploaded'
      });
    }

    const imageUrl = req.file.location;

    res.status(200).json({
      success: true,
      message: 'Onboarding image uploaded successfully',
      data: {
        imageUrl
      }
    });
  } catch (error) {
    console.error('Error uploading onboarding image:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to upload onboarding image',
      error: error.message
    });
  }
};

// Upload AI Integration Image
export const uploadAIImage = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: 'No image file uploaded'
      });
    }

    const imageUrl = req.file.location;

    res.status(200).json({
      success: true,
      message: 'AI integration image uploaded successfully',
      data: {
        imageUrl
      }
    });
  } catch (error) {
    console.error('Error uploading AI integration image:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to upload AI integration image',
      error: error.message
    });
  }
};

// ========================= CRUD CONTROLLERS =========================

// Get Application of Technology page data (Public)
export const getApplicationOfTechnologyPage = async (req, res) => {
  try {
    const appTechPage = await ApplicationOfTechnologyPage.findOne({ is_active: true })
      .select('-__v')
      .lean();

    if (!appTechPage) {
      return res.status(404).json({
        success: false,
        message: 'Application of Technology page data not found'
      });
    }

    // Sort arrays by display_order
    if (appTechPage.digitalClassroomSection?.tools) {
      appTechPage.digitalClassroomSection.tools.sort((a, b) => (a.display_order || 0) - (b.display_order || 0));
    }
    if (appTechPage.onboardingSection?.steps) {
      appTechPage.onboardingSection.steps.sort((a, b) => (a.display_order || 0) - (b.display_order || 0));
    }
    if (appTechPage.digitalToolboxSection?.tools) {
      appTechPage.digitalToolboxSection.tools.sort((a, b) => (a.display_order || 0) - (b.display_order || 0));
    }
    if (appTechPage.aiIntegrationSection?.tools) {
      appTechPage.aiIntegrationSection.tools.sort((a, b) => (a.display_order || 0) - (b.display_order || 0));
    }

    res.status(200).json({
      success: true,
      data: appTechPage
    });
  } catch (error) {
    console.error('Error fetching Application of Technology page:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch Application of Technology page data',
      error: error.message
    });
  }
};

// Get Application of Technology page data (Admin)
export const getAdminApplicationOfTechnologyPage = async (req, res) => {
  try {
    const appTechPage = await ApplicationOfTechnologyPage.findOne()
      .select('-__v')
      .lean();

    if (!appTechPage) {
      return res.status(404).json({
        success: false,
        message: 'Application of Technology page data not found'
      });
    }

    // Sort arrays by display_order
    if (appTechPage.digitalClassroomSection?.tools) {
      appTechPage.digitalClassroomSection.tools.sort((a, b) => (a.display_order || 0) - (b.display_order || 0));
    }
    if (appTechPage.onboardingSection?.steps) {
      appTechPage.onboardingSection.steps.sort((a, b) => (a.display_order || 0) - (b.display_order || 0));
    }
    if (appTechPage.digitalToolboxSection?.tools) {
      appTechPage.digitalToolboxSection.tools.sort((a, b) => (a.display_order || 0) - (b.display_order || 0));
    }
    if (appTechPage.aiIntegrationSection?.tools) {
      appTechPage.aiIntegrationSection.tools.sort((a, b) => (a.display_order || 0) - (b.display_order || 0));
    }

    res.status(200).json({
      success: true,
      data: appTechPage
    });
  } catch (error) {
    console.error('Error fetching admin Application of Technology page:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch admin Application of Technology page data',
      error: error.message
    });
  }
};

// Create or Update Application of Technology page data
export const createOrUpdateApplicationOfTechnologyPage = async (req, res) => {
  try {
    const {
      headerSection,
      digitalClassroomSection,
      onboardingSection,
      digitalToolboxSection,
      hybridLearningSection,
      powerBackupSection,
      aiIntegrationSection,
      salesforceCRMSection,
      missionSection,
      callToActionSection
    } = req.body;

    let appTechPage = await ApplicationOfTechnologyPage.findOne();

    if (!appTechPage) {
      // Create new page if it doesn't exist
      appTechPage = new ApplicationOfTechnologyPage({
        headerSection,
        digitalClassroomSection,
        onboardingSection,
        digitalToolboxSection,
        hybridLearningSection,
        powerBackupSection,
        aiIntegrationSection,
        salesforceCRMSection,
        missionSection,
        callToActionSection
      });
      await appTechPage.save();
      return res.status(201).json({
        success: true,
        message: 'Application of Technology page created successfully',
        data: appTechPage
      });
    } else {
      // Update existing page
      appTechPage.headerSection = headerSection;
      appTechPage.digitalClassroomSection = digitalClassroomSection;
      appTechPage.onboardingSection = onboardingSection;
      appTechPage.digitalToolboxSection = digitalToolboxSection;
      appTechPage.hybridLearningSection = hybridLearningSection;
      appTechPage.powerBackupSection = powerBackupSection;
      appTechPage.aiIntegrationSection = aiIntegrationSection;
      appTechPage.salesforceCRMSection = salesforceCRMSection;
      appTechPage.missionSection = missionSection;
      appTechPage.callToActionSection = callToActionSection;

      await appTechPage.save();
      return res.status(200).json({
        success: true,
        message: 'Application of Technology page updated successfully',
        data: appTechPage
      });
    }
  } catch (error) {
    console.error('Error creating/updating Application of Technology page:', error);
    console.error('Error details:', error.message);
    if (error.name === 'ValidationError') {
      console.error('Validation errors:', error.errors);
    }
    res.status(500).json({
      success: false,
      message: 'Failed to create/update Application of Technology page data',
      error: error.message,
      validationErrors: error.errors ? Object.keys(error.errors).map(key => ({
        field: key,
        message: error.errors[key].message
      })) : []
    });
  }
};

// Update Application of Technology page data (specific PUT route)
export const updateApplicationOfTechnologyPage = async (req, res) => {
  try {
    const {
      headerSection,
      digitalClassroomSection,
      onboardingSection,
      digitalToolboxSection,
      hybridLearningSection,
      powerBackupSection,
      aiIntegrationSection,
      salesforceCRMSection,
      missionSection,
      callToActionSection
    } = req.body;

    const appTechPage = await ApplicationOfTechnologyPage.findOne();

    if (!appTechPage) {
      return res.status(404).json({
        success: false,
        message: 'Application of Technology page not found'
      });
    }

    appTechPage.headerSection = headerSection;
    appTechPage.digitalClassroomSection = digitalClassroomSection;
    appTechPage.onboardingSection = onboardingSection;
    appTechPage.digitalToolboxSection = digitalToolboxSection;
    appTechPage.hybridLearningSection = hybridLearningSection;
    appTechPage.powerBackupSection = powerBackupSection;
    appTechPage.aiIntegrationSection = aiIntegrationSection;
    appTechPage.salesforceCRMSection = salesforceCRMSection;
    appTechPage.missionSection = missionSection;
    appTechPage.callToActionSection = callToActionSection;

    await appTechPage.save();

    res.status(200).json({
      success: true,
      message: 'Application of Technology page updated successfully',
      data: appTechPage
    });
  } catch (error) {
    console.error('Error updating Application of Technology page:', error);
    console.error('Error details:', error.message);
    if (error.name === 'ValidationError') {
      console.error('Validation errors:', error.errors);
    }
    res.status(500).json({
      success: false,
      message: 'Failed to update Application of Technology page data',
      error: error.message,
      validationErrors: error.errors ? Object.keys(error.errors).map(key => ({
        field: key,
        message: error.errors[key].message
      })) : []
    });
  }
};

