import ElementaryMiddleSchoolPage from '../models/ElementaryMiddleSchoolPage.js';

// Get elementary middle school page data (Public)
export const getElementaryMiddleSchoolPage = async (req, res) => {
  try {
    const page = await ElementaryMiddleSchoolPage.findOne({ is_active: true })
      .select('-__v')
      .lean();
    
    if (!page) {
      return res.status(404).json({
        success: false,
        message: 'Elementary Middle School page data not found'
      });
    }
    
    // Sort arrays by display_order
    if (page.structuralChallengesSection && page.structuralChallengesSection.challenges) {
      page.structuralChallengesSection.challenges.sort((a, b) => {
        const orderA = a.display_order || 0;
        const orderB = b.display_order || 0;
        if (orderA === orderB) {
          return a._id.toString().localeCompare(b._id.toString());
        }
        return orderA - orderB;
      });
    }
    
    if (page.neieaResponseSection && page.neieaResponseSection.responses) {
      page.neieaResponseSection.responses.sort((a, b) => {
        const orderA = a.display_order || 0;
        const orderB = b.display_order || 0;
        if (orderA === orderB) {
          return a._id.toString().localeCompare(b._id.toString());
        }
        return orderA - orderB;
      });
    }
    
    if (page.programsSection && page.programsSection.programs) {
      page.programsSection.programs.sort((a, b) => {
        const orderA = a.display_order || 0;
        const orderB = b.display_order || 0;
        if (orderA === orderB) {
          return a._id.toString().localeCompare(b._id.toString());
        }
        return orderA - orderB;
      });
    }
    
    if (page.testimonialsSection && page.testimonialsSection.testimonials) {
      page.testimonialsSection.testimonials.sort((a, b) => {
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
      data: page
    });
  } catch (error) {
    console.error('Error fetching elementary middle school page:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch elementary middle school page data',
      error: error.message
    });
  }
};

