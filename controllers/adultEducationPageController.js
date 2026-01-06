import AdultEducationPage from '../models/AdultEducationPage.js';

// Public: Get Adult Education page (active)
export const getAdultEducationPage = async (req, res) => {
  try {
    const page = await AdultEducationPage.findOne({ is_active: true }).select('-__v').lean();

    if (!page) {
      return res.status(404).json({ success: false, message: 'Adult Education page not found' });
    }

    if (page.learningModel?.features) {
      page.learningModel.features.sort((a, b) => (a.display_order || 0) - (b.display_order || 0));
    }
    if (page.focusAreas?.areas) {
      page.focusAreas.areas.sort((a, b) => (a.display_order || 0) - (b.display_order || 0));
    }

    return res.status(200).json({ success: true, data: page });
  } catch (error) {
    console.error('Error fetching adult education page:', error);
    return res.status(500).json({ success: false, message: 'Failed to fetch Adult Education page', error: error.message });
  }
};


