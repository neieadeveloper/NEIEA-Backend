import TechnicalSkillTrainingPage from '../models/TechnicalSkillTrainingPage.js';

// Public: Get Technical Skill Training page data
export const getTechnicalSkillTrainingPage = async (req, res) => {
  try {
    const page = await TechnicalSkillTrainingPage.findOne({ is_active: true })
      .select('-__v')
      .lean();

    if (!page) {
      return res.status(404).json({ success: false, message: 'Technical Skill Training page data not found' });
    }

    const safeSort = (arr) => {
      if (!Array.isArray(arr)) return [];
      return arr.sort((a, b) => {
        const orderA = a.display_order || 0;
        const orderB = b.display_order || 0;
        if (orderA === orderB) return a._id.toString().localeCompare(b._id.toString());
        return orderA - orderB;
      });
    };

    if (page.targetGroupsSection?.groups) page.targetGroupsSection.groups = safeSort(page.targetGroupsSection.groups);
    if (page.learningModesSection?.modes) page.learningModesSection.modes = safeSort(page.learningModesSection.modes);
    if (page.impactAreasSection?.areas) page.impactAreasSection.areas = safeSort(page.impactAreasSection.areas);
    if (page.testimonialsSection?.testimonials) page.testimonialsSection.testimonials = safeSort(page.testimonialsSection.testimonials);

    return res.status(200).json({ success: true, data: page });
  } catch (error) {
    console.error('Error fetching technical skill training page:', error);
    return res.status(500).json({ success: false, message: 'Failed to fetch technical skill training page data', error: error.message });
  }
};


