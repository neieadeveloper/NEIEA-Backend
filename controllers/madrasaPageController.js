import MadrasaPage from '../models/MadrasaPage.js';

export const getMadrasaPage = async (req, res) => {
  try {
    const page = await MadrasaPage.findOne({ is_active: true }).lean();
    if (!page) return res.status(404).json({ success:false, message:'Madrasa page not found' });
    const sort = (arr)=>arr?.sort((a,b)=> (a.display_order||0)-(b.display_order||0));
    if (page.objectivesSection?.cards) sort(page.objectivesSection.cards);
    if (page.featuresSection?.cards) sort(page.featuresSection.cards);
    if (page.impactSection?.cards) sort(page.impactSection.cards);
    if (page.challengesSection?.cards) sort(page.challengesSection.cards);
    return res.status(200).json({ success:true, data: page });
  } catch (e) {
    return res.status(500).json({ success:false, message:'Failed to fetch page', error: e.message });
  }
};


