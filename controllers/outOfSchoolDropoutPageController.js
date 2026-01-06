import OutOfSchoolDropoutPage from '../models/OutOfSchoolDropoutPage.js';

export const getOutOfSchoolDropoutPage = async (req, res) => {
  try {
    const page = await OutOfSchoolDropoutPage.findOne({ is_active: true }).lean();
    if (!page) {
      return res.status(404).json({ success: false, message: 'Out Of School / Dropout page not found' });
    }
    // sort display orders
    if (page.obeProgramSection?.programs) page.obeProgramSection.programs.sort((a,b)=> (a.display_order||0)-(b.display_order||0));
    if (page.secondaryProgramSection?.subjects) page.secondaryProgramSection.subjects.sort((a,b)=> (a.display_order||0)-(b.display_order||0));
    if (page.gallerySection?.images) page.gallerySection.images.sort((a,b)=> (a.display_order||0)-(b.display_order||0));
    if (page.impactSection?.cards) page.impactSection.cards.sort((a,b)=> (a.display_order||0)-(b.display_order||0));
    return res.status(200).json({ success: true, data: page });
  } catch (e) {
    return res.status(500).json({ success: false, message: 'Failed to fetch page', error: e.message });
  }
};


