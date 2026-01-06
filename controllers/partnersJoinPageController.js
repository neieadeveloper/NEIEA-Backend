import PartnersJoinPage from '../models/PartnersJoinPage.js';

// Public: Get active Partners Join page
export const getPartnersJoinPage = async (req, res) => {
  try {
    const page = await PartnersJoinPage.findOne({ is_active: true })
      .select('-__v')
      .lean();

    if (!page) {
      return res.status(404).json({ success: false, message: 'Partners Join page not found' });
    }

    // Ensure points and modes are ordered by display_order, stable by _id
    if (page.whyCollaborateSection?.points) {
      page.whyCollaborateSection.points.sort((a, b) => {
        const A = a.display_order || 0; const B = b.display_order || 0;
        return A === B ? a._id.toString().localeCompare(b._id.toString()) : A - B;
      });
    }
    if (page.howYouCanPartnerSection?.modes) {
      page.howYouCanPartnerSection.modes.sort((a, b) => {
        const A = a.display_order || 0; const B = b.display_order || 0;
        return A === B ? a._id.toString().localeCompare(b._id.toString()) : A - B;
      });
    }

    return res.status(200).json({ success: true, data: page });
  } catch (error) {
    console.error('Error fetching Partners Join page:', error);
    return res.status(500).json({ success: false, message: 'Failed to fetch Partners Join page', error: error.message });
  }
};

// Admin: Get active page (non-lean, for editing)
export const getPartnersJoinPageAdmin = async (req, res) => {
  try {
    const page = await PartnersJoinPage.findOne({ is_active: true }).select('-__v');
    if (!page) {
      return res.status(404).json({ success: false, message: 'Partners Join page not found' });
    }
    return res.status(200).json({ success: true, data: page });
  } catch (error) {
    console.error('Error fetching Partners Join admin page:', error);
    return res.status(500).json({ success: false, message: 'Failed to fetch Partners Join admin page', error: error.message });
  }
};

// Admin: Create or update whole page (idempotent upsert for single active doc)
export const createOrUpdatePartnersJoinPage = async (req, res) => {
  try {
    const existing = await PartnersJoinPage.findOne({ is_active: true });
    if (!existing) {
      const created = await PartnersJoinPage.create(req.body);
      return res.status(201).json({ success: true, data: created, message: 'Partners Join page created successfully' });
    }

    Object.assign(existing, req.body || {});
    await existing.save();
    return res.status(200).json({ success: true, data: existing, message: 'Partners Join page updated successfully' });
  } catch (error) {
    console.error('Error creating/updating Partners Join page:', error);
    return res.status(500).json({ success: false, message: 'Failed to create/update Partners Join page', error: error.message });
  }
};

// Admin: Section-level update (partial)
export const updatePartnersJoinPage = async (req, res) => {
  try {
    const page = await PartnersJoinPage.findOne({ is_active: true });
    if (!page) {
      return res.status(404).json({ success: false, message: 'Partners Join page not found' });
    }

    const { headerSection, overviewSection, whyCollaborateSection, howYouCanPartnerSection, partneringWithCharitiesSection, callToActionSection } = req.body || {};
    if (headerSection) page.headerSection = headerSection;
    if (overviewSection) page.overviewSection = overviewSection;
    if (whyCollaborateSection) page.whyCollaborateSection = whyCollaborateSection;
    if (howYouCanPartnerSection) page.howYouCanPartnerSection = howYouCanPartnerSection;
    if (partneringWithCharitiesSection) page.partneringWithCharitiesSection = partneringWithCharitiesSection;
    if (callToActionSection) page.callToActionSection = callToActionSection;

    await page.save();
    return res.status(200).json({ success: true, data: page, message: 'Partners Join page updated successfully' });
  } catch (error) {
    console.error('Error updating Partners Join page:', error);
    return res.status(500).json({ success: false, message: 'Failed to update Partners Join page', error: error.message });
  }
};

// Admin: Upload header banner image (uses req.file.location)
export const uploadHeaderImage = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ success: false, message: 'No image file provided' });
    }
    const imageUrl = req.file.location;
    const page = await PartnersJoinPage.findOne({ is_active: true });
    if (!page) {
      return res.status(404).json({ success: false, message: 'Partners Join page not found. Please create the page first.' });
    }
    page.headerSection = page.headerSection || { title: '', subtitle: '' };
    page.headerSection.imageUrl = imageUrl;
    await page.save();
    return res.status(200).json({ success: true, data: { imageUrl }, message: 'Header image uploaded successfully' });
  } catch (error) {
    console.error('Error uploading header image:', error);
    return res.status(500).json({ success: false, message: 'Failed to upload header image', error: error.message });
  }
};

// Admin: Upload symbolic image for partneringWithCharitiesSection
export const uploadCharitiesSymbolicImage = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ success: false, message: 'No image file provided' });
    }
    const imageUrl = req.file.location;
    const page = await PartnersJoinPage.findOne({ is_active: true });
    if (!page) {
      return res.status(404).json({ success: false, message: 'Partners Join page not found. Please create the page first.' });
    }
    page.partneringWithCharitiesSection = page.partneringWithCharitiesSection || { title: '', paragraphs: [] };
    page.partneringWithCharitiesSection.imageUrl = imageUrl;
    await page.save();
    return res.status(200).json({ success: true, data: { imageUrl }, message: 'Symbolic image uploaded successfully' });
  } catch (error) {
    console.error('Error uploading symbolic image:', error);
    return res.status(500).json({ success: false, message: 'Failed to upload symbolic image', error: error.message });
  }
};


