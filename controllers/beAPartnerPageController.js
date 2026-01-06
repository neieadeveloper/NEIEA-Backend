import BeAPartnerPage from '../models/BeAPartnerPage.js';

export const getBeAPartnerPage = async (req, res) => {
  try {
    const page = await BeAPartnerPage.findOne({ is_active: true }).lean();
    if (!page) return res.status(404).json({ success:false, message:'Be A Partner page not found' });
    const sort = (arr)=>arr?.sort((a,b)=> (a.display_order||0)-(b.display_order||0));
    sort(page.whySupportSection?.points);
    sort(page.waysToHelpSection?.points);
    return res.status(200).json({ success:true, data: page });
  } catch (e) {
    return res.status(500).json({ success:false, message:'Failed to fetch page', error:e.message });
  }
};


