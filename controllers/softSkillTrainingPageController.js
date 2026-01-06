import SoftSkillTrainingPage from '../models/SoftSkillTrainingPage.js';

// Public: Get Soft Skill Training page data
export const getSoftSkillTrainingPage = async (req, res) => {
  try {
    const page = await SoftSkillTrainingPage.findOne({ is_active: true })
      .select('-__v')
      .lean();

    if (!page) {
      return res.status(404).json({
        success: false,
        message: 'Soft Skill Training page data not found'
      });
    }

    if (page.keyBenefitsSection && page.keyBenefitsSection.benefits) {
      page.keyBenefitsSection.benefits.sort((a, b) => {
        const orderA = a.display_order || 0;
        const orderB = b.display_order || 0;
        if (orderA === orderB) return a._id.toString().localeCompare(b._id.toString());
        return orderA - orderB;
      });
    }

    if (page.programHighlightsSection && page.programHighlightsSection.highlights) {
      page.programHighlightsSection.highlights.sort((a, b) => {
        const orderA = a.display_order || 0;
        const orderB = b.display_order || 0;
        if (orderA === orderB) return a._id.toString().localeCompare(b._id.toString());
        return orderA - orderB;
      });
    }

    res.status(200).json({ success: true, data: page });
  } catch (error) {
    console.error('Error fetching soft skill training page:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch soft skill training page data',
      error: error.message
    });
  }
};


