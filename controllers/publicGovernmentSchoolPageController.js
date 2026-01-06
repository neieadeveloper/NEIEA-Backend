import PublicGovernmentSchoolPage from '../models/PublicGovernmentSchoolPage.js';

// Get public government school page data (Public)
export const getPublicGovernmentSchoolPage = async (req, res) => {
  try {
    const page = await PublicGovernmentSchoolPage.findOne({ is_active: true })
      .select('-__v')
      .lean();
    
    if (!page) {
      return res.status(404).json({
        success: false,
        message: 'Public Government School page data not found'
      });
    }
    
    // Sort arrays by display_order
    if (page.challengesSection?.challenges) {
      page.challengesSection.challenges.sort((a, b) => (a.display_order || 0) - (b.display_order || 0));
    }
    if (page.modelSection?.models) {
      page.modelSection.models.sort((a, b) => (a.display_order || 0) - (b.display_order || 0));
    }
    if (page.caseStudySection?.results) {
      page.caseStudySection.results.sort((a, b) => (a.display_order || 0) - (b.display_order || 0));
    }
    if (page.pilotProjectSection?.goals) {
      page.pilotProjectSection.goals.sort((a, b) => (a.display_order || 0) - (b.display_order || 0));
    }
    if (page.whyPartnerSection?.reasons) {
      page.whyPartnerSection.reasons.sort((a, b) => (a.display_order || 0) - (b.display_order || 0));
    }
    if (page.callToActionSection?.actionItems) {
      page.callToActionSection.actionItems.sort((a, b) => (a.display_order || 0) - (b.display_order || 0));
    }
    
    res.status(200).json({
      success: true,
      data: page
    });
  } catch (error) {
    console.error('Error fetching public government school page:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch public government school page data',
      error: error.message
    });
  }
};
