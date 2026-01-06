import PrivacyPolicyPage from '../models/PrivacyPolicyPage.js';

export const getPrivacyPolicyPage = async (req, res) => {
  try {
    const page = await PrivacyPolicyPage.findOne({ is_active: true }).select('-__v').lean();
    if (!page) return res.status(404).json({ success: false, message: 'Privacy Policy page not found' });
    if (page.sections) page.sections.sort((a,b)=>(a.display_order||0)-(b.display_order||0));
    return res.status(200).json({ success: true, data: page });
  } catch (error) {
    return res.status(500).json({ success: false, message: 'Failed to fetch page', error: error.message });
  }
};


