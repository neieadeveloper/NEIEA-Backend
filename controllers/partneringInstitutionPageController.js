import PartneringInstitutionPage from '../models/PartneringInstitutionPage.js';

// Get partnering institution page data (Public)
export const getPartneringInstitutionPage = async (req, res) => {
  try {
    const page = await PartneringInstitutionPage.findOne({ is_active: true })
      .select('-__v')
      .lean();
    
    if (!page) {
      return res.status(404).json({
        success: false,
        message: 'Partnering Institution page data not found'
      });
    }
    
    // Sort explore network items by display_order
    if (page.exploreNetworkSection && page.exploreNetworkSection.items) {
      page.exploreNetworkSection.items.sort((a, b) => {
        const orderA = a.display_order || 0;
        const orderB = b.display_order || 0;
        
        if (orderA === orderB) {
          return a._id.toString().localeCompare(b._id.toString());
        }
        
        return orderA - orderB;
      });
    }
    
    res.status(200).json({
      success: true,
      data: page
    });
  } catch (error) {
    console.error('Error fetching partnering institution page:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch partnering institution page data',
      error: error.message
    });
  }
};

// Get partnering institution page data for admin
export const getPartneringInstitutionPageAdmin = async (req, res) => {
  try {
    const page = await PartneringInstitutionPage.findOne({ is_active: true })
      .select('-__v');
    
    if (!page) {
      return res.status(404).json({
        success: false,
        message: 'Partnering Institution page data not found'
      });
    }
    
    res.status(200).json({
      success: true,
      data: page
    });
  } catch (error) {
    console.error('Error fetching partnering institution page:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch partnering institution page data',
      error: error.message
    });
  }
};

// Create partnering institution page
export const createPartneringInstitutionPage = async (req, res) => {
  try {
    const page = await PartneringInstitutionPage.create(req.body);
    
    res.status(201).json({
      success: true,
      data: page,
      message: 'Partnering Institution page created successfully'
    });
  } catch (error) {
    console.error('Error creating partnering institution page:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to create partnering institution page',
      error: error.message
    });
  }
};

// Update partnering institution page
export const updatePartneringInstitutionPage = async (req, res) => {
  try {
    const page = await PartneringInstitutionPage.findOne({ is_active: true });
    
    if (!page) {
      return res.status(404).json({
        success: false,
        message: 'Partnering Institution page not found'
      });
    }
    
    // Update all sections
    if (req.body.headerSection) {
      page.headerSection = req.body.headerSection;
    }
    if (req.body.overviewSection) {
      page.overviewSection = req.body.overviewSection;
    }
    if (req.body.partnershipModelSection) {
      page.partnershipModelSection = req.body.partnershipModelSection;
    }
    if (req.body.exploreNetworkSection) {
      page.exploreNetworkSection = req.body.exploreNetworkSection;
    }
    if (req.body.callToActionSection) {
      page.callToActionSection = req.body.callToActionSection;
    }
    
    await page.save();
    
    res.status(200).json({
      success: true,
      data: page,
      message: 'Partnering Institution page updated successfully'
    });
  } catch (error) {
    console.error('Error updating partnering institution page:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update partnering institution page',
      error: error.message
    });
  }
};

// Delete partnering institution page
export const deletePartneringInstitutionPage = async (req, res) => {
  try {
    const page = await PartneringInstitutionPage.findOne({ is_active: true });
    
    if (!page) {
      return res.status(404).json({
        success: false,
        message: 'Partnering Institution page not found'
      });
    }
    
    await PartneringInstitutionPage.findByIdAndDelete(page._id);
    
    res.status(200).json({
      success: true,
      message: 'Partnering Institution page deleted successfully'
    });
  } catch (error) {
    console.error('Error deleting partnering institution page:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to delete partnering institution page',
      error: error.message
    });
  }
};

// Upload header image
export const uploadHeaderImage = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: 'No image file provided'
      });
    }

    const imageUrl = req.file.location; // S3 URL
    
    // Find and update the page with the new image URL
    const page = await PartneringInstitutionPage.findOne({ is_active: true });
    
    if (!page) {
      return res.status(404).json({
        success: false,
        message: 'Partnering Institution page not found. Please create the page first.'
      });
    }

    // Update only the imageUrl while preserving other header fields
    if (page.headerSection) {
      page.headerSection.imageUrl = imageUrl;
    } else {
      page.headerSection = {
        title: '',
        subtitle: '',
        description: '',
        imageUrl: imageUrl
      };
    }

    await page.save();

    res.status(200).json({
      success: true,
      data: {
        imageUrl: imageUrl
      },
      message: 'Header image uploaded successfully'
    });
  } catch (error) {
    console.error('Error uploading header image:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to upload header image',
      error: error.message
    });
  }
};
