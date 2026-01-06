import TeachersTrainingPage from '../models/TeachersTrainingPage.js';

export const getTeachersTrainingPage = async (req, res) => {
  try {
    const page = await TeachersTrainingPage.findOne({ is_active: true }).lean();
    if (!page) return res.status(404).json({ success:false, message:'Teachers Training page not found' });
    const sort = (arr)=>arr?.sort((a,b)=> (a.display_order||0)-(b.display_order||0));
    sort(page.trainingPathwaysSection?.items);
    sort(page.coreComponentsSection?.items);
    sort(page.skillsGainedSection?.items);
    sort(page.whyChooseUsSection?.items);
    return res.status(200).json({ success:true, data: page });
  } catch (e) {
    return res.status(500).json({ success:false, message:'Failed to fetch page', error:e.message });
  }
};


