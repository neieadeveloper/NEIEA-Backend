import ReportsFinancialsPage from '../models/ReportsFinancialsPage.js';
import { deleteSingleImageFromS3 } from '../utils/s3Cleanup.js';

// ========================= FILE UPLOAD CONTROLLERS =========================

// Upload Hero Image
export const uploadHeroImage = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: 'No image file uploaded'
      });
    }

    const imageUrl = req.file.location;

    res.status(200).json({
      success: true,
      message: 'Hero image uploaded successfully',
      data: { imageUrl }
    });
  } catch (error) {
    console.error('Error uploading hero image:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to upload hero image',
      error: error.message
    });
  }
};

// Helper function to extract S3 key from URL
const extractS3KeyFromUrl = (url) => {
  if (!url) return null;
  
  try {
    // If it's already a key (doesn't start with http), return as is
    if (!url.startsWith('http')) {
      return url;
    }
    
    // Extract key from S3 URL
    // URL format: https://bucket-name.s3.region.amazonaws.com/key/path
    // or: https://s3.region.amazonaws.com/bucket-name/key/path
    const urlObj = new URL(url);
    let key = urlObj.pathname;
    
    // Remove leading slash
    if (key.startsWith('/')) {
      key = key.substring(1);
    }
    
    // If bucket name is in hostname (s3.amazonaws.com format), remove it from path
    if (urlObj.hostname.includes('s3') && !urlObj.hostname.startsWith('s3.')) {
      // Format: bucket-name.s3.region.amazonaws.com
      const bucketName = urlObj.hostname.split('.')[0];
      if (key.startsWith(bucketName + '/')) {
        key = key.substring(bucketName.length + 1);
      }
    }
    
    return key;
  } catch (error) {
    console.error('Error extracting S3 key from URL:', error);
    // Fallback: try to extract from path
    const urlParts = url.split('/');
    // Get everything after the domain
    const domainIndex = url.indexOf('//') + 2;
    const pathStart = url.indexOf('/', domainIndex);
    if (pathStart !== -1) {
      return url.substring(pathStart + 1);
    }
    return null;
  }
};

// Upload Impact Report PDF
export const uploadImpactReportPDF = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: 'No PDF file uploaded'
      });
    }

    // Validate file size (10MB = 10485760 bytes)
    const maxSize = 10 * 1024 * 1024; // 10MB in bytes
    if (req.file.size > maxSize) {
      // Delete the uploaded file from S3 if size validation fails
      if (req.file.key) {
        await deleteSingleImageFromS3(req.file.key);
      }
      return res.status(400).json({
        success: false,
        message: 'File size must be less than 10MB'
      });
    }

    const newPdfUrl = req.file.location;
    const newPdfKey = req.file.key;
    const fileSize = (req.file.size / 1024 / 1024).toFixed(2) + ' MB';

    // Get existing PDF URL from database
    const reportsPage = await ReportsFinancialsPage.findOne();
    
    if (reportsPage && reportsPage.impactReportSection && reportsPage.impactReportSection.pdfUrl) {
      const oldPdfUrl = reportsPage.impactReportSection.pdfUrl;
      
      // Extract S3 key from old PDF URL
      const oldPdfKey = extractS3KeyFromUrl(oldPdfUrl);
      
      // Delete old PDF from S3 if it exists
      if (oldPdfKey) {
        try {
          await deleteSingleImageFromS3(oldPdfKey);
          console.log('Successfully deleted old PDF from S3:', oldPdfKey);
        } catch (deleteError) {
          console.error('Error deleting old PDF from S3:', deleteError);
          // Continue even if deletion fails - the new file is already uploaded
        }
      }
    }

    // Update database with new PDF URL
    if (reportsPage) {
      reportsPage.impactReportSection = reportsPage.impactReportSection || {};
      reportsPage.impactReportSection.pdfUrl = newPdfUrl;
      await reportsPage.save();
    } else {
      // If no page exists, create one with the PDF URL
      const newReportsPage = new ReportsFinancialsPage({
        headerSection: { title: '', subtitle: '', description: '', heroImage: '' },
        missionSection: { title: '', description: '' },
        keyHighlightsSection: { sectionLabel: '', title: '', description: '', highlights: [] },
        impactReportSection: { title: '', description: '', pdfUrl: newPdfUrl, buttonText: '' }
      });
      await newReportsPage.save();
    }

    res.status(200).json({
      success: true,
      message: 'PDF uploaded successfully',
      data: { pdfUrl: newPdfUrl, fileSize }
    });
  } catch (error) {
    console.error('Error uploading PDF:', error);
    
    // Clean up uploaded file if there was an error
    if (req.file && req.file.key) {
      try {
        await deleteSingleImageFromS3(req.file.key);
      } catch (cleanupError) {
        console.error('Error cleaning up uploaded file:', cleanupError);
      }
    }
    
    res.status(500).json({
      success: false,
      message: 'Failed to upload PDF',
      error: error.message
    });
  }
};

// ========================= CRUD CONTROLLERS =========================

// Get Reports & Financials page data (Public)
export const getReportsFinancialsPage = async (req, res) => {
  try {
    const reportsPage = await ReportsFinancialsPage.findOne({ is_active: true })
      .select('-__v')
      .lean();

    if (!reportsPage) {
      return res.status(404).json({
        success: false,
        message: 'Reports & Financials page data not found'
      });
    }

    // Sort highlights by display_order
    if (reportsPage.keyHighlightsSection?.highlights) {
      reportsPage.keyHighlightsSection.highlights.sort((a, b) => (a.display_order || 0) - (b.display_order || 0));
    }

    res.status(200).json({
      success: true,
      data: reportsPage
    });
  } catch (error) {
    console.error('Error fetching Reports & Financials page:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch Reports & Financials page data',
      error: error.message
    });
  }
};

// Get Reports & Financials page data (Admin)
export const getAdminReportsFinancialsPage = async (req, res) => {
  try {
    const reportsPage = await ReportsFinancialsPage.findOne()
      .select('-__v')
      .lean();

    if (!reportsPage) {
      return res.status(404).json({
        success: false,
        message: 'Reports & Financials page data not found'
      });
    }

    // Sort highlights by display_order
    if (reportsPage.keyHighlightsSection?.highlights) {
      reportsPage.keyHighlightsSection.highlights.sort((a, b) => (a.display_order || 0) - (b.display_order || 0));
    }

    res.status(200).json({
      success: true,
      data: reportsPage
    });
  } catch (error) {
    console.error('Error fetching admin Reports & Financials page:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch admin Reports & Financials page data',
      error: error.message
    });
  }
};

// Create or Update Reports & Financials page data
export const createOrUpdateReportsFinancialsPage = async (req, res) => {
  try {
    const {
      headerSection,
      missionSection,
      keyHighlightsSection,
      impactReportSection
    } = req.body;

    let reportsPage = await ReportsFinancialsPage.findOne();

    if (!reportsPage) {
      // Create new page if it doesn't exist
      reportsPage = new ReportsFinancialsPage({
        headerSection,
        missionSection,
        keyHighlightsSection,
        impactReportSection
      });
      await reportsPage.save();
      return res.status(201).json({
        success: true,
        message: 'Reports & Financials page created successfully',
        data: reportsPage
      });
    } else {
      // Update existing page
      reportsPage.headerSection = headerSection;
      reportsPage.missionSection = missionSection;
      reportsPage.keyHighlightsSection = keyHighlightsSection;
      reportsPage.impactReportSection = impactReportSection;

      await reportsPage.save();
      return res.status(200).json({
        success: true,
        message: 'Reports & Financials page updated successfully',
        data: reportsPage
      });
    }
  } catch (error) {
    console.error('Error creating/updating Reports & Financials page:', error);
    console.error('Error details:', error.message);
    if (error.name === 'ValidationError') {
      console.error('Validation errors:', error.errors);
    }
    res.status(500).json({
      success: false,
      message: 'Failed to create/update Reports & Financials page data',
      error: error.message,
      validationErrors: error.errors ? Object.keys(error.errors).map(key => ({
        field: key,
        message: error.errors[key].message
      })) : []
    });
  }
};

// Update Reports & Financials page data (specific PUT route)
export const updateReportsFinancialsPage = async (req, res) => {
  try {
    const {
      headerSection,
      missionSection,
      keyHighlightsSection,
      impactReportSection
    } = req.body;

    const reportsPage = await ReportsFinancialsPage.findOne();

    if (!reportsPage) {
      return res.status(404).json({
        success: false,
        message: 'Reports & Financials page not found'
      });
    }

    reportsPage.headerSection = headerSection;
    reportsPage.missionSection = missionSection;
    reportsPage.keyHighlightsSection = keyHighlightsSection;
    reportsPage.impactReportSection = impactReportSection;

    await reportsPage.save();

    res.status(200).json({
      success: true,
      message: 'Reports & Financials page updated successfully',
      data: reportsPage
    });
  } catch (error) {
    console.error('Error updating Reports & Financials page:', error);
    console.error('Error details:', error.message);
    if (error.name === 'ValidationError') {
      console.error('Validation errors:', error.errors);
    }
    res.status(500).json({
      success: false,
      message: 'Failed to update Reports & Financials page data',
      error: error.message,
      validationErrors: error.errors ? Object.keys(error.errors).map(key => ({
        field: key,
        message: error.errors[key].message
      })) : []
    });
  }
};
