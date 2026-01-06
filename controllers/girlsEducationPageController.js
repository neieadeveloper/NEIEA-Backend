import GirlsEducationPage from '../models/GirlsEducationPage.js';

// Get girls education page data (Public)
export const getGirlsEducationPage = async (req, res) => {
  try {
    const page = await GirlsEducationPage.findOne({ is_active: true })
      .select('-__v')
      .lean();
    
    if (!page) {
      return res.status(404).json({
        success: false,
        message: 'Girls Education page data not found'
      });
    }
    
    // Sort arrays by display_order
    if (page.initiativesSection && page.initiativesSection.initiatives) {
      page.initiativesSection.initiatives.sort((a, b) => {
        const orderA = a.display_order || 0;
        const orderB = b.display_order || 0;
        if (orderA === orderB) {
          return a._id.toString().localeCompare(b._id.toString());
        }
        return orderA - orderB;
      });
    }
    
    if (page.impactSection && page.impactSection.partnerOrganizationsByState) {
      page.impactSection.partnerOrganizationsByState.sort((a, b) => {
        const orderA = a.display_order || 0;
        const orderB = b.display_order || 0;
        if (orderA === orderB) {
          return a._id.toString().localeCompare(b._id.toString());
        }
        return orderA - orderB;
      });
      
      // Sort partners within each state
      page.impactSection.partnerOrganizationsByState.forEach(state => {
        if (state.partners && Array.isArray(state.partners)) {
          state.partners.sort((a, b) => {
            const orderA = a.display_order || 0;
            const orderB = b.display_order || 0;
            if (orderA === orderB) {
              return a._id.toString().localeCompare(b._id.toString());
            }
            return orderA - orderB;
          });
        }
      });
    }
    
    if (page.lookingForwardSection && page.lookingForwardSection.futureVisionCards) {
      page.lookingForwardSection.futureVisionCards.sort((a, b) => {
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
    console.error('Error fetching girls education page:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch girls education page data',
      error: error.message
    });
  }
};

