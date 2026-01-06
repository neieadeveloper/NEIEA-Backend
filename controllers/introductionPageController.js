import IntroductionPage from '../models/IntroductionPage.js';

// Get introduction page data (Public)
export const getIntroductionPage = async (req, res) => {
  try {
    const introductionPage = await IntroductionPage.findOne({ is_active: true })
      .select('-__v')
      .lean();
    
    if (!introductionPage) {
      return res.status(404).json({
        success: false,
        message: 'Introduction page data not found'
      });
    }
    
    res.status(200).json({
      success: true,
      data: introductionPage
    });
  } catch (error) {
    console.error('Error fetching introduction page:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch introduction page data',
      error: error.message
    });
  }
};

// Get introduction page data (Admin)
export const getIntroductionPageAdmin = async (req, res) => {
  try {
    const introductionPage = await IntroductionPage.findOne({ is_active: true })
      .select('-__v')
      .lean();
    
    if (!introductionPage) {
      return res.status(404).json({
        success: false,
        message: 'Introduction page data not found'
      });
    }
    
    res.status(200).json({
      success: true,
      data: introductionPage
    });
  } catch (error) {
    console.error('Error fetching introduction page:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch introduction page data',
      error: error.message
    });
  }
};

// Create introduction page (Admin)
export const createIntroductionPage = async (req, res) => {
  try {
    const { visionMissionSection, registrationSection } = req.body;

    // Check if introduction page already exists
    const existingPage = await IntroductionPage.findOne({ is_active: true });
    if (existingPage) {
      return res.status(400).json({
        success: false,
        message: 'Introduction page already exists. Use update instead.'
      });
    }

    const introductionPage = await IntroductionPage.create({
      visionMissionSection,
      registrationSection
    });

    res.status(201).json({
      success: true,
      data: introductionPage,
      message: 'Introduction page created successfully'
    });
  } catch (error) {
    console.error('Error creating introduction page:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to create introduction page',
      error: error.message
    });
  }
};

// Update introduction page (Admin)
export const updateIntroductionPage = async (req, res) => {
  try {
    const { visionMissionSection, registrationSection } = req.body;

    let introductionPage = await IntroductionPage.findOne({ is_active: true });

    if (!introductionPage) {
      // Create new if doesn't exist
      introductionPage = await IntroductionPage.create({
        visionMissionSection,
        registrationSection
      });
    } else {
      // Update existing
      introductionPage.visionMissionSection = visionMissionSection;
      introductionPage.registrationSection = registrationSection;
      await introductionPage.save();
    }

    res.status(200).json({
      success: true,
      data: introductionPage,
      message: 'Introduction page updated successfully'
    });
  } catch (error) {
    console.error('Error updating introduction page:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update introduction page',
      error: error.message
    });
  }
};

// Delete introduction page (Admin)
export const deleteIntroductionPage = async (req, res) => {
  try {
    const introductionPage = await IntroductionPage.findOne({ is_active: true });
    
    if (!introductionPage) {
      return res.status(404).json({
        success: false,
        message: 'Introduction page not found'
      });
    }

    await IntroductionPage.findByIdAndDelete(introductionPage._id);

    res.status(200).json({
      success: true,
      message: 'Introduction page deleted successfully'
    });
  } catch (error) {
    console.error('Error deleting introduction page:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to delete introduction page',
      error: error.message
    });
  }
};
