import Contact from '../models/Contact.js';
import ContactForm from '../models/ContactForm.js';
import sendDonationEmail from '../services/emailService.js';
import ErrorResponse from '../utils/errorResponse.js';

// @desc    Get contact information (Public)
// @route   GET /api/contact
// @access  Public
export const getContactInfo = async (req, res) => {
  try {
    const contact = await Contact.findOne({ is_active: true });

    // Return null data instead of 404 error for public - let frontend handle the case
    res.status(200).json({
      success: true,
      data: contact || null
    });
  } catch (error) {
    console.error('Error fetching contact information:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch contact information'
    });
  }
};

// @desc    Get contact information (Admin)
// @route   GET /api/admin/contact
// @access  Private/Admin
export const getContactInfoAdmin = async (req, res) => {
  try {
    const contact = await Contact.findOne({ is_active: true });

    // Return null data instead of 404 error for admin - let frontend handle the case
    res.status(200).json({
      success: true,
      data: contact || null
    });
  } catch (error) {
    console.error('Error fetching contact information:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch contact information'
    });
  }
};

// @desc    Update contact information
// @route   PUT /api/admin/contact
// @access  Private/Admin
export const updateContactInfo = async (req, res) => {
  try {
    const {
      location,
      email,
      phone,
      workingHours,
      organizationName,
      addressLine1,
      addressLine2,
      city,
      state,
      postalCode,
      country
    } = req.body;

    // Validate required fields
    const requiredFields = {
      location,
      email,
      phone,
      workingHours,
      organizationName,
      addressLine1,
      city,
      state,
      postalCode,
      country
    };

    for (const [field, value] of Object.entries(requiredFields)) {
      if (!value || value.trim() === '') {
        return res.status(400).json({
          success: false,
          message: `${field.charAt(0).toUpperCase() + field.slice(1)} is required`
        });
      }
    }

    // Find existing contact info or create new one
    let contact = await Contact.findOne({ is_active: true });

    if (!contact) {
      // Create new contact info
      contact = await Contact.create({
        location,
        email,
        phone,
        workingHours,
        organizationName,
        addressLine1,
        addressLine2,
        city,
        state,
        postalCode,
        country
      });
    } else {
      // Update existing contact info
      contact.location = location;
      contact.email = email;
      contact.phone = phone;
      contact.workingHours = workingHours;
      contact.organizationName = organizationName;
      contact.addressLine1 = addressLine1;
      contact.addressLine2 = addressLine2;
      contact.city = city;
      contact.state = state;
      contact.postalCode = postalCode;
      contact.country = country;

      await contact.save();
    }

    res.status(200).json({
      success: true,
      data: contact,
      message: 'Contact information updated successfully'
    });
  } catch (error) {
    console.error('Error updating contact information:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update contact information',
      error: error.message
    });
  }
};

// @desc    Submit contact form
// @route   POST /api/contact-form
// @access  Public
export const submitContactForm = async (req, res) => {
  try {
    const { name, email, affiliation, inquiryType, message } = req.body;

    // Validate required fields
    if (!name || !email || !inquiryType || !message) {
      return res.status(400).json({
        success: false,
        message: 'Please provide all required fields'
      });
    }

    // Save contact form submission to database using ContactForm model
    const contactFormSubmission = await ContactForm.create({
      name,
      email,
      affiliation: affiliation || '',
      inquiryType,
      message
    });

    res.status(200).json({
      success: true,
      message: 'Your message has been sent successfully! We will get back to you soon.',
      data: {
        id: contactFormSubmission._id,
        submittedAt: contactFormSubmission.createdAt
      }
    });
  } catch (error) {
    console.error('Error submitting contact form:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to submit contact form. Please try again.'
    });
  }
};

// ==================== ADMIN CONTACT INQUIRIES MANAGEMENT ====================

// @desc    Get all contact inquiries (Admin only)
// @route   GET /api/admin/contact-inquiries
// @access  Private (Admin)
export const getAllContactInquiries = async (req, res, next) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;
    const status = req.query.status;
    const inquiryType = req.query.inquiryType;

    // Build query
    let query = { is_active: true };
    if (status) {
      query.status = status;
    }
    if (inquiryType) {
      query.inquiryType = inquiryType;
    }

    const inquiries = await ContactForm.find(query)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    const total = await ContactForm.countDocuments(query);

    res.status(200).json({
      success: true,
      data: inquiries,
      pagination: {
        currentPage: page,
        totalPages: Math.ceil(total / limit),
        totalItems: total,
        itemsPerPage: limit
      }
    });
  } catch (error) {
    console.error("Error fetching contact inquiries:", error);
    next(new ErrorResponse("Server error while fetching contact inquiries", 500));
  }
};

// @desc    Get single contact inquiry by ID (Admin only)
// @route   GET /api/admin/contact-inquiries/:id
// @access  Private (Admin)
export const getContactInquiryById = async (req, res, next) => {
  try {
    const inquiry = await ContactForm.findById(req.params.id);

    if (!inquiry) {
      return next(new ErrorResponse("Contact inquiry not found", 404));
    }

    res.status(200).json({
      success: true,
      data: inquiry
    });
  } catch (error) {
    console.error("Error fetching contact inquiry:", error);
    next(new ErrorResponse("Server error while fetching contact inquiry", 500));
  }
};

// @desc    Update contact inquiry status (Admin only)
// @route   PUT /api/admin/contact-inquiries/:id
// @access  Private (Admin)
export const updateContactInquiry = async (req, res, next) => {
  try {
    const { status, notes } = req.body;

    if (status && !['new', 'read', 'replied', 'closed'].includes(status)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid status. Must be new, read, replied, or closed'
      });
    }

    const updateData = {};
    if (status) updateData.status = status;
    if (notes !== undefined) updateData.notes = notes;

    const inquiry = await ContactForm.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true, runValidators: true }
    );

    if (!inquiry) {
      return next(new ErrorResponse("Contact inquiry not found", 404));
    }

    res.status(200).json({
      success: true,
      data: inquiry
    });
  } catch (error) {
    console.error("Error updating contact inquiry:", error);
    next(new ErrorResponse("Server error while updating contact inquiry", 500));
  }
};

// @desc    Delete contact inquiry (Admin only)
// @route   DELETE /api/admin/contact-inquiries/:id
// @access  Private (Admin)
export const deleteContactInquiry = async (req, res, next) => {
  try {
    const inquiry = await ContactForm.findByIdAndUpdate(
      req.params.id,
      { is_active: false },
      { new: true }
    );

    if (!inquiry) {
      return next(new ErrorResponse("Contact inquiry not found", 404));
    }

    res.status(200).json({
      success: true,
      message: "Contact inquiry deleted successfully"
    });
  } catch (error) {
    console.error("Error deleting contact inquiry:", error);
    next(new ErrorResponse("Server error while deleting contact inquiry", 500));
  }
};

// @desc    Delete multiple contact inquiries (Admin only)
// @route   DELETE /api/admin/contact-inquiries/bulk
// @access  Private (Admin)
export const deleteMultipleContactInquiries = async (req, res, next) => {
  try {
    const { ids } = req.body;

    if (!ids || !Array.isArray(ids) || ids.length === 0) {
      return res.status(400).json({
        success: false,
        message: "Please provide an array of IDs to delete"
      });
    }

    const result = await ContactForm.updateMany(
      { _id: { $in: ids } },
      { is_active: false }
    );

    res.status(200).json({
      success: true,
      message: `${result.modifiedCount} contact inquiries deleted successfully`
    });
  } catch (error) {
    console.error("Error deleting multiple contact inquiries:", error);
    next(new ErrorResponse("Server error while deleting contact inquiries", 500));
  }
};

// @desc    Get contact inquiry statistics (Admin only)
// @route   GET /api/admin/contact-inquiries/stats
// @access  Private (Admin)
export const getContactInquiryStats = async (req, res, next) => {
  try {
    const total = await ContactForm.countDocuments({ is_active: true });
    const newCount = await ContactForm.countDocuments({ status: 'new', is_active: true });
    const readCount = await ContactForm.countDocuments({ status: 'read', is_active: true });
    const repliedCount = await ContactForm.countDocuments({ status: 'replied', is_active: true });
    const closedCount = await ContactForm.countDocuments({ status: 'closed', is_active: true });

    console.log('Stats calculation:', {
      total,
      newCount,
      readCount,
      repliedCount,
      closedCount
    });

    // Get inquiry type breakdown
    const inquiryTypeStats = await ContactForm.aggregate([
      { $match: { is_active: true } },
      { $group: { _id: '$inquiryType', count: { $sum: 1 } } },
      { $sort: { count: -1 } }
    ]);

    const statsData = {
      total,
      byStatus: {
        new: newCount,
        read: readCount,
        replied: repliedCount,
        closed: closedCount
      },
      byInquiryType: inquiryTypeStats
    };

    console.log('Final stats data:', statsData);

    res.status(200).json({
      success: true,
      data: statsData
    });
  } catch (error) {
    console.error("Error fetching contact inquiry stats:", error);
    next(new ErrorResponse("Server error while fetching contact inquiry stats", 500));
  }
};