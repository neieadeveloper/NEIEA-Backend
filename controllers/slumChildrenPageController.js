import SlumChildrenPage from '../models/SlumChildrenPage.js';

// Get slum children page data (Public)
export const getSlumChildrenPage = async (req, res) => {
  try {
    const page = await SlumChildrenPage.findOne({ is_active: true })
      .select('-__v')
      .lean();
    
    if (!page) {
      return res.status(404).json({
        success: false,
        message: 'Slum Children page data not found'
      });
    }
    
    // Sort arrays by display_order
    if (page.programFeaturesSection && page.programFeaturesSection.features) {
      page.programFeaturesSection.features.sort((a, b) => {
        const orderA = a.display_order || 0;
        const orderB = b.display_order || 0;
        if (orderA === orderB) {
          return a._id.toString().localeCompare(b._id.toString());
        }
        return orderA - orderB;
      });
    }
    
    if (page.challengesSection && page.challengesSection.challenges) {
      page.challengesSection.challenges.sort((a, b) => {
        const orderA = a.display_order || 0;
        const orderB = b.display_order || 0;
        if (orderA === orderB) {
          return a._id.toString().localeCompare(b._id.toString());
        }
        return orderA - orderB;
      });
    }
    
    if (page.partnershipSection && page.partnershipSection.partnerships) {
      page.partnershipSection.partnerships.sort((a, b) => {
        const orderA = a.display_order || 0;
        const orderB = b.display_order || 0;
        if (orderA === orderB) {
          return a._id.toString().localeCompare(b._id.toString());
        }
        return orderA - orderB;
      });
    }
    
    if (page.successOutcomesSection && page.successOutcomesSection.outcomes) {
      page.successOutcomesSection.outcomes.sort((a, b) => {
        const orderA = a.display_order || 0;
        const orderB = b.display_order || 0;
        if (orderA === orderB) {
          return a._id.toString().localeCompare(b._id.toString());
        }
        return orderA - orderB;
      });
    }
    
    if (page.approachSection && page.approachSection.items) {
      page.approachSection.items.sort((a, b) => {
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
    console.error('Error fetching slum children page:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch slum children page data',
      error: error.message
    });
  }
};

