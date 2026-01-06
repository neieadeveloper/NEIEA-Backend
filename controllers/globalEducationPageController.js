import GlobalEducationPage from '../models/GlobalEducationPage.js';

export const getGlobalEducationPage = async (req, res) => {
  try {
    const page = await GlobalEducationPage.findOne({ is_active: true }).select('-__v').lean();
    if (!page) return res.status(404).json({ success: false, message: 'Global Education page not found' });

    if (page.sdgFocusSection?.contributions) {
      page.sdgFocusSection.contributions.sort((a, b) => (a.display_order || 0) - (b.display_order || 0));
    }
    if (page.valuesList) {
      page.valuesList.sort((a, b) => (a.display_order || 0) - (b.display_order || 0));
    }
    return res.status(200).json({ success: true, data: page });
  } catch (error) {
    console.error('Error fetching global education page:', error);
    return res.status(500).json({ success: false, message: 'Failed to fetch page', error: error.message });
  }
};


