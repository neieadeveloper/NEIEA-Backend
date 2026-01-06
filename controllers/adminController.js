import Admin from "../models/Admin.js";
import DonorUser from "../models/DonorUser.js";
import Student from "../models/Student.js";
import Course from "../models/Course.js";
import Institution from '../models/Institution.js';
import Carousel from '../models/Carousel.js';
import sendDonationEmail from "../services/emailService.js";
import jwt from "jsonwebtoken";
import sendProgressTemplate from "../templates/sendProgressTemplate.js";
import assignStudentTemplate from "../templates/assignStudentTemplate.js";
import ErrorResponse from "../utils/errorResponse.js";
import { deleteImagesFromS3, deleteSingleImageFromS3 } from "../utils/s3Cleanup.js";
import VideoCard from "../models/VideoCard.js";
import HeroSection from "../models/HeroSection.js";
import BulletPoint from "../models/BulletPoint.js";
// import Testimonial from "../models/Testimonial.js";
import { CardTestimonial, VideoTestimonial, FeaturedStory } from "../models/Testimonial.js";
import Section from "../models/Section.js";
import ReferredBy from "../models/ReferredBy.js";
import validator from 'validator';
import GalleryItem from '../models/GalleryItem.js';
import PartnerInstitution from '../models/PartnerInstitution.js';
import CareerPage from '../models/CareerPage.js';
import GlobalPartner from '../models/GlobalPartnersPage.js';
import IntroductionPage from '../models/IntroductionPage.js';
import ElementaryMiddleSchoolPage from '../models/ElementaryMiddleSchoolPage.js';
import SlumChildrenPage from '../models/SlumChildrenPage.js';
import PublicGovernmentSchoolPage from '../models/PublicGovernmentSchoolPage.js';
import OutOfSchoolDropoutPage from '../models/OutOfSchoolDropoutPage.js';
import MadrasaPage from '../models/MadrasaPage.js';
import TeachersTrainingPage from '../models/TeachersTrainingPage.js';
import BeAPartnerPage from '../models/BeAPartnerPage.js';
import NeiUsaIntroductionPage from '../models/NeiUsaIntroductionPage.js';
import GirlsEducationPage from '../models/GirlsEducationPage.js';
import AdultEducationPage from '../models/AdultEducationPage.js';
import GlobalEducationPage from '../models/GlobalEducationPage.js';
import PrivacyPolicyPage from '../models/PrivacyPolicyPage.js';

function createS3KeyFromImageUrl(url) {
  const urlParts = url.split('/');
  return urlParts.slice(-2).join('/'); // Get the last two parts (folder/filename)
}

export const createAdmin = async (req, res) => {
  const { firstName, lastName, email, password, role } = req.body;
  const currentUserRole = req.user.role;

  // Role-based validation
  if (currentUserRole === 'admin' && role === 'superadmin') {
    return res.status(403).json({
      success: false,
      message: 'Admin users cannot create superadmin accounts'
    });
  }

  // Validate role
  if (role && !['admin', 'superadmin'].includes(role)) {
    return res.status(400).json({
      success: false,
      message: 'Invalid role. Must be admin or superadmin'
    });
  }

  const adminExists = await Admin.findOne({ email });
  if (adminExists) {
    return res.status(400).json({
      success: false,
      message: "Admin already exists with this email"
    });
  }

  const admin = await Admin.create({
    firstName,
    lastName,
    email,
    password,
    role: role || "admin",
  });

  if (admin) {
    res.status(201).json({
      success: true,
      data: {
        _id: admin._id,
        firstName: admin.firstName,
        lastName: admin.lastName,
        email: admin.email,
        role: admin.role,
      }
    });
  } else {
    res.status(400).json({
      success: false,
      message: "Invalid admin data"
    });
  }
};

export const getAdmin = async (req, res, next) => {
  try {
    const user = await Admin.findById(req.user.id);

    console.log(req.user._id);

    res.status(200).json({
      success: true,
      data: user,
    });
  } catch (err) {
    next(err);
  }
};

export const getAllAdmins = async (req, res, next) => {
  try {
    const currentUserRole = req.user.role;
    
    // Build query based on user role
    let query = {};
    if (currentUserRole === 'admin') {
      // Admin users can only see other admin users, not superadmins
      query = { role: 'admin' };
    }
    // Superadmin users can see all users (no filter)

    const admins = await Admin.find(query);

    if (!admins || admins.length === 0) {
      return next(new ErrorResponse("No admins found", 404));
    }

    res.status(200).json({
      success: true,
      data: admins,
    });
  } catch (error) {
    console.error("Error fetching admins:", error);
    next(new ErrorResponse("Server error while fetching admins", 500));
  }
};
export const loginAdmin = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    // Validate input
    if (!email || !password) {
      return next(
        new ErrorResponse("Please provide an email and password", 400)
      );
    }

    // Find admin by email
    const admin = await Admin.findOne({ email }).select("+password");

    if (!admin) {
      return next(new ErrorResponse("Invalid credentials", 401));
    }

    // Check password
    const isMatch = await admin.comparePassword(password);

    if (!isMatch) {
      return next(new ErrorResponse("Invalid credentials", 401));
    }

    // Create token
    const token = jwt.sign({ id: admin._id }, process.env.JWT_SECRET, {
      expiresIn: process.env.JWT_EXPIRE,
    });

    // Set cookie options
    const options = {
      expires: new Date(
        Date.now() + process.env.JWT_COOKIE_EXPIRE * 24 * 60 * 60 * 1000
      ),
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
    };

    // Send response with token and admin info
    res
      .status(200)
      .cookie("token", token, options)
      .json({
        success: true,
        token,
        admin: {
          id: admin._id,
          username: admin.username,
          email: admin.email,
        },
      });
  } catch (err) {
    console.error("Admin login error:", err);
    next(new ErrorResponse("Server error during admin login", 500));
  }
};

// Update Admin
export const updateAdmin = async (req, res) => {
  try {
    const { firstName, lastName, email, role } = req.body;
    const currentUserRole = req.user.role;
    const adminId = req.params.id;

    // Check if admin exists
    const existingAdmin = await Admin.findById(adminId);
    if (!existingAdmin) {
      return res.status(404).json({
        success: false,
        message: "Admin not found"
      });
    }

    // Role-based validation for role updates
    if (role) {
      // Admin users cannot update roles to superadmin
      if (currentUserRole === 'admin' && role === 'superadmin') {
        return res.status(403).json({
          success: false,
          message: 'Admin users cannot promote others to superadmin'
        });
      }

      // Admin users cannot update superadmin roles
      if (currentUserRole === 'admin' && existingAdmin.role === 'superadmin') {
        return res.status(403).json({
          success: false,
          message: 'Admin users cannot modify superadmin accounts'
        });
      }

      // Validate role
      if (!['admin', 'superadmin'].includes(role)) {
        return res.status(400).json({
          success: false,
          message: 'Invalid role. Must be admin or superadmin'
        });
      }
    }

    // Check for email conflicts (if email is being updated)
    if (email && email !== existingAdmin.email) {
      const emailExists = await Admin.findOne({ email, _id: { $ne: adminId } });
      if (emailExists) {
        return res.status(400).json({
          success: false,
          message: "Email already exists"
        });
      }
    }

    const admin = await Admin.findByIdAndUpdate(
      adminId,
      { firstName, lastName, email, role },
      { new: true, runValidators: true }
    );

    res.status(200).json({
      success: true,
      data: admin,
    });
  } catch (error) {
    console.error("Error updating admin:", error);
    res
      .status(500)
      .json({ success: false, message: "Server error while updating admin" });
  }
};

// Delete Admin
export const deleteAdmin = async (req, res) => {
  try {
    const currentUserRole = req.user.role;
    const adminId = req.params.id;

    // Check if admin exists
    const admin = await Admin.findById(adminId);
    if (!admin) {
      return res.status(404).json({
        success: false,
        message: "Admin not found"
      });
    }

    // Role-based validation
    if (currentUserRole === 'admin' && admin.role === 'superadmin') {
      return res.status(403).json({
        success: false,
        message: 'Admin users cannot delete superadmin accounts'
      });
    }

    // Prevent self-deletion
    if (adminId === req.user.id) {
      return res.status(403).json({
        success: false,
        message: 'You cannot delete your own account'
      });
    }

    await Admin.findByIdAndDelete(adminId);
    
    res.status(200).json({
      success: true,
      message: "Admin deleted successfully",
    });
  } catch (error) {
    console.error("Error deleting admin:", error);
    res
      .status(500)
      .json({ success: false, message: "Server error while deleting admin" });
  }
};

// Assign a student to a donor
export const assignStudent = async (req, res) => {
  try {
    const { donorId, studentData } = req.body;
    const adminId = req.user.id;

    // Create a new student
    const student = new Student({ ...studentData, donor: donorId });
    await student.save();

    // Update the donor's students array with the new student's ID
    const donor = await DonorUser.findByIdAndUpdate(
      donorId,
      { $push: { students: student._id } },
      { new: true }
    );

    // Fetch the admin details
    const admin = await Admin.findById(adminId);

    if (donor) {
      // Send notification to donor
      await sendDonationEmail({
        type: "assignStudent",
        to: donor.email,
        subject: "Student Assigned",
        html: assignStudentTemplate(donor, studentData),
      });

      // Send notification to admin
      await sendDonationEmail({
        type: "assignStudent",
        to: admin.email,
        subject: "Student Assigned to Donor",
        html: assignStudentTemplate(donor, studentData),
      });
    }

    res.status(201).json({
      success: true,
      data: student,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

// Update student progress
export const updateStudentProgress = async (req, res) => {
  try {
    const { studentId, progressData } = req.body;

    // Ensure progressData includes the details
    if (!progressData.details) {
      return res.status(400).json({
        success: false,
        message: "Progress details are required",
      });
    }

    const student = await Student.findById(studentId);
    if (!student) {
      return res.status(404).json({
        success: false,
        message: "Student not found",
      });
    }

    // Add the progress details to the student's progress array
    student.progress.push({
      details: progressData.details,
      date: new Date(),
    });

    await student.save();

    const donor = await DonorUser.findById(student.donor);
    if (donor) {
      await sendDonationEmail({
        type: "progressUpdate",
        to: donor.email,
        subject: "Student Progress Update",
        html: sendProgressTemplate(donor, student, progressData.details),
      });
    }

    res.status(200).json({
      success: true,
      data: student,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};
// Create a new course
export const createCourse = async (req, res) => {
  try {
    const { title, description, duration, level, fees, targetAudience, whatsappLink, adminId, timeSlots, isNew, category } = req.body;
    const imageUrl = req.file ? req.file.location : null; // S3 URL is in req.file.location
    const course = new Course({
      title,
      description,
      duration,
      createdBy: adminId,
      imageUrl,
      level,
      fees,
      targetAudience,
      whatsappLink,
      timeSlots,
      category,
      isNew: (isNew === true || isNew === 'true') ? true : false
    });
    await course.save();
    res.status(201).json(course);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Get all courses
export const getAllCourses = async (req, res) => {
  try {
    const courses = await Course.find().populate("applicants").populate("institutions"); // ✅ now pulls full data
    res.status(200).json(courses);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const updateCourse = async (req, res) => {
  const { courseId } = req.params;
  const {
    title,
    description,
    duration,
    level,
    category,
    fees,
    targetAudience,
    whatsappLink,
    timeSlots,
    isNew
  } = req.body;
  // Validate required fields
  if (!title || !description || !duration || !level || !fees || !targetAudience || !whatsappLink || !timeSlots || !category) {
    if (req.file) {
      // Clean up uploaded image if validation fails
      await deleteImagesFromS3([req.file]);
    }
    return res.status(400).json({ success: false, message: "All fields are required." });
  }
  let course;
  try {
    course = await Course.findById(courseId);
    if (!course) {
      if (req.file) {
        await deleteImagesFromS3([req.file]);
      }
      return res.status(404).json({ success: false, message: "Course not found." });
    }

    let oldImageKey = null;
    let newImageUrl = course.imageUrl;

    // If a new image is uploaded, prepare to delete the old one
    if (req.file) {
      // Save the new image URL
      newImageUrl = req.file.location;
      // Extract the S3 key from the old image URL if it exists
      if (course.imageUrl) {
        const urlParts = course.imageUrl.split('/');
        oldImageKey = urlParts.slice(-2).join('/');
      }
    }

    // Update the course fields
    course.title = title;
    course.description = description;
    course.duration = duration;
    course.level = level;
    course.category = category;
    course.fees = fees;
    course.targetAudience = targetAudience;
    course.whatsappLink = whatsappLink;
    course.updatedBy = req.user.id;
    course.imageUrl = newImageUrl;
    course.timeSlots = timeSlots;
    course.isNew = (isNew === true || isNew === 'true') ? true : false;

    await course.save();

    // If a new image was uploaded and there was an old image, delete the old image from S3
    if (req.file && oldImageKey) {
      await deleteSingleImageFromS3(oldImageKey);
    }

    res.status(200).json({ success: true, data: course });
  } catch (error) {
    // If a new image was uploaded but an error occurred, clean up the new image from S3
    if (req.file) {
      await deleteImagesFromS3([req.file]);
    }
    res.status(500).json({ success: false, message: error.message });
  }
};

export const deleteCourse = async (req, res) => {
  try {
    const { courseId } = req.params;

    const deletedCourse = await Course.findByIdAndDelete(courseId);

    if (!deletedCourse) {
      return res.status(404).json({ message: "Course not found" });
    }

    res.status(200).json({ message: "Course deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get all donors
export const getAllDonors = async (req, res) => {
  try {
    // Fetch donors and populate the 'students' and 'donations' fields
    const donors = await DonorUser.find()
      .populate({
        path: "students",
        options: { sort: { createdAt: -1 } }, // Sort students by creation date, newest first
      })
      .populate("donations"); // Populate the donations field

    // Structure the response to include donor details, their assigned students, and total donation amount
    const responseData = donors.map((donor) => {
      // Calculate the total donation amount for the donor
      const totalDonationAmount = donor.donations.reduce((sum, donation) => {
        return sum + donation.amount;
      }, 0);

      return {
        _id: donor._id,
        firstName: donor.firstName,
        lastName: donor.lastName,
        email: donor.email,
        phone: donor.phone,
        donorType: donor.donorType,
        students: donor.students, // This will include the populated student details
        donations: donor.donations, // This will include the populated donation details
        totalDonationAmount, // Include the total donation amount
        createdAt: donor.createdAt,
        lastLogin: donor.lastLogin,
      };
    });

    res.status(200).json({
      success: true,
      data: responseData,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Get all donations
// export const getAllDonations = async (req, res) => {
//   try {
//     const donations = await Donation.find({ donationType: '' })


//     const responseData = donations.map((donation) => {


//       return {
//         _id: donation._id,
//         amount: donation.amount,
//         donationType: donation.donationType,
//       };
//     });

//     res.status(200).json({
//       success: true,
//       data: responseData,
//     });
//   } catch (error) {
//     res.status(500).json({
//       success: false,
//       message: error.message,
//     });
//   }
// };

export const getAllInstitutions = async (req, res) => {
  try {
    const institutions = await Institution.find()
      .populate({
        path: 'appliedCourses',
        select: '-applicants' // This will exclude the applicants field
      });

    res.status(200).json(institutions);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Create or update carousel for a page
export const createOrUpdateCarousel = async (req, res, next) => {
  try {
    const { page, headings, subTexts, ctaTexts, ctaUrls } = req.body;

    // Validate required fields
    if (!page) {
      await deleteImagesFromS3(req.files);
      return next(new ErrorResponse('Page name is required', 400));
    }

    // Check if files were uploaded
    if (!req.files || req.files.length === 0) {
      return next(new ErrorResponse('At least one image is required', 400));
    }

    // Controller validation: check images length
    if (req.files.length > 3) {
      await deleteImagesFromS3(req.files);
      return next(new ErrorResponse('Carousel cannot have more than 3 images', 400));
    }

    // Parse the form data arrays (they come as strings from form data)
    let headingsArray, subTextsArray, ctaTextsArray, ctaUrlsArray;

    try {
      headingsArray = headings ? JSON.parse(headings) : [];
      subTextsArray = subTexts ? JSON.parse(subTexts) : [];
      ctaTextsArray = ctaTexts ? JSON.parse(ctaTexts) : [];
      ctaUrlsArray = ctaUrls ? JSON.parse(ctaUrls) : [];
    } catch (parseError) {
      await deleteImagesFromS3(req.files);
      return next(new ErrorResponse('Invalid JSON format in form data', 400));
    }

    // Check if carousel already exists for this page
    const existingCarousel = await Carousel.findOne({ page });

    // If updating existing carousel, handle old images
    if (existingCarousel && existingCarousel.images && existingCarousel.images.length > 0) {
      // Delete old images from S3
      const oldImageKeys = existingCarousel.images.map(img => {
        // Extract key from S3 URL
        const urlParts = img.url.split('/');
        return urlParts.slice(-2).join('/'); // Get the last two parts (folder/filename)
      });

      // Delete old images from S3
      for (const key of oldImageKeys) {
        await deleteSingleImageFromS3(key);
      }
    }

    // Create images array with S3 URLs and form data
    const images = req.files.map((file, index) => ({
      url: file.location, // S3 URL
      heading: headingsArray[index] || null,
      subText: subTextsArray[index] || null,
      ctaText: ctaTextsArray[index] || null,
      ctaUrl: ctaUrlsArray[index] || null
    }));

    // Upsert carousel (create or update)
    const carousel = await Carousel.findOneAndUpdate(
      { page },
      { page, images },
      {
        new: true,
        upsert: true,
        runValidators: true
      }
    );

    res.status(200).json({
      success: true,
      data: carousel,
      message: existingCarousel ? 'Carousel updated successfully' : 'Carousel created successfully'
    });

  } catch (error) {
    // Clean up uploaded images if any error occurs
    if (req.files && req.files.length > 0) {
      await deleteImagesFromS3(req.files);
    }
    next(error);
  }
};

// Add a new video card
export const addVideoCard = async (req, res) => {
  try {
    const thumbnail = req.file ? req.file.location : null; // S3 URL is in req.file.location
    const card = new VideoCard({
      ...req.body,
      thumbnail
    });
    await card.save();
    res.json({ success: true, data: card });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
};

// Update a video card
export const updateVideoCard = async (req, res) => {
  try {
    const { id } = req.params;
    const updateData = req.body;

    // Retrieve the existing video card data
    const existingCard = await VideoCard.findById(id);
    if (!existingCard) {
      return res.status(404).json({ success: false, message: 'Video card not found' });
    }

    // If a new file was uploaded, update the thumbnail URL
    if (req.file) {
      // Delete the old thumbnail from S3
      if (existingCard.thumbnail) {
        const oldFileKey = existingCard.thumbnail.split('/').pop(); // Extract the file key from the URL
        await deleteSingleImageFromS3(oldFileKey);
      }

      updateData.thumbnail = req.file.location; // Update with the new file's URL
    }

    const card = await VideoCard.findByIdAndUpdate(id, updateData, { new: true });
    if (!card) return res.status(404).json({ success: false, message: 'Not found' });
    res.json({ success: true, data: card });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
};

// Delete a video card
export const deleteVideoCard = async (req, res) => {
  try {
    const { id } = req.params;
    // Retrieve the video card data to get the thumbnail URL
    const videoCard = await VideoCard.findById(id);
    if (!videoCard) {
      return res.status(404).json({ success: false, message: 'Video card not found' });
    }

    // Delete the thumbnail image from S3
    if (videoCard.thumbnail) {
      const fileKey = videoCard.thumbnail.split('/').pop(); // Extract the file key from the URL
      await deleteSingleImageFromS3(fileKey);
    }

    // Delete the video card from the database
    await VideoCard.findByIdAndDelete(id);
    res.json({ success: true });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
};


// Add a new hero section
export const addHeroSection = async (req, res) => {
  try {
    const heroSection = new HeroSection(req.body);
    await heroSection.save();
    res.json({ success: true, data: heroSection });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
};

// Update a hero section
export const updateHeroSection = async (req, res) => {
  try {
    const { id } = req.params;
    const heroSection = await HeroSection.findByIdAndUpdate(id, req.body, { new: true });
    if (!heroSection) return res.status(404).json({ success: false, message: 'Not found' });
    res.json({ success: true, data: heroSection });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
};

// Delete a hero section
export const deleteHeroSection = async (req, res) => {
  try {
    const { id } = req.params;
    await HeroSection.findByIdAndDelete(id);
    res.json({ success: true });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
};

// Bullet Point Admin Functions
export const addBulletPoint = async (req, res) => {
  try {
    const bulletPoint = new BulletPoint(req.body);
    await bulletPoint.save();
    res.json({ success: true, data: bulletPoint });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
};

export const updateBulletPoint = async (req, res) => {
  try {
    const { id } = req.params;
    const bulletPoint = await BulletPoint.findByIdAndUpdate(id, req.body, { new: true });
    if (!bulletPoint) return res.status(404).json({ success: false, message: 'Not found' });
    res.json({ success: true, data: bulletPoint });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
};

export const deleteBulletPoint = async (req, res) => {
  try {
    const { id } = req.params;
    await BulletPoint.findByIdAndDelete(id);
    res.json({ success: true });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
};

// Testimonial Admin Functions
// export const addTestimonial = async (req, res) => {
//   try {
//     const testimonial = new Testimonial(req.body);
//     await testimonial.save();
//     res.json({ success: true, data: testimonial });
//   } catch (err) {
//     res.status(400).json({ success: false, message: err.message });
//   }
// };

// export const updateTestimonial = async (req, res) => {
//   try {
//     const { id } = req.params;
//     const testimonial = await Testimonial.findByIdAndUpdate(id, req.body, { new: true });
//     if (!testimonial) return res.status(404).json({ success: false, message: 'Not found' });
//     res.json({ success: true, data: testimonial });
//   } catch (err) {
//     res.status(400).json({ success: false, message: err.message });
//   }
// };

// export const deleteTestimonial = async (req, res) => {
//   try {
//     const { id } = req.params;
//     await Testimonial.findByIdAndDelete(id);
//     res.json({ success: true });
//   } catch (err) {
//     res.status(400).json({ success: false, message: err.message });
//   }
// };

// Sections Admin Functions with S3 Image Handling
export const addSection = async (req, res, next) => {
  try {
    const { page, heading, subHeading, body, orientation } = req.body;

    // Validate required fields
    if (!page || !heading || !body || !orientation) {
      if (req.file) {
        // Clean up uploaded image if validation fails
        await deleteImagesFromS3([req.file]);
      }
      return next(new ErrorResponse('All fields are required', 400));
    }

    // Validate orientation
    if (!['left', 'right'].includes(orientation)) {
      if (req.file) {
        await deleteImagesFromS3([req.file]);
      }
      return next(new ErrorResponse('Orientation must be either "left" or "right"', 400));
    }

    // Handle image upload (optional)
    const imageUrl = req.file ? req.file.location : null; // S3 URL if uploaded

    const section = new Section({
      page,
      heading,
      subHeading,
      body,
      imageUrl,
      orientation
    });

    await section.save();

    res.status(201).json({
      success: true,
      data: section,
      message: 'New section created successfully'
    });

  } catch (error) {
    // Clean up uploaded image if any error occurs
    if (req.file) {
      await deleteImagesFromS3([req.file]);
    }
    next(error);
  }
};

export const updateSection = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { page, heading, subHeading, body, orientation } = req.body;

    // Validate required fields
    if (!page || !heading || !body || !orientation) {
      if (req.file) {
        await deleteImagesFromS3([req.file]);
      }
      return next(new ErrorResponse('All fields are required', 400));
    }

    // Validate orientation
    if (!['left', 'right'].includes(orientation)) {
      if (req.file) {
        await deleteImagesFromS3([req.file]);
      }
      return next(new ErrorResponse('Orientation must be either "left" or "right"', 400));
    }

    // Find existing Section
    const existingSection = await Section.findById(id);
    if (!existingSection) {
      if (req.file) {
        await deleteImagesFromS3([req.file]);
      }
      return next(new ErrorResponse('Section not found', 404));
    }

    let oldImageKey = null;
    let newImageUrl = existingSection.imageUrl;

    // If a new image is uploaded, prepare to delete the old one
    if (req.file) {
      newImageUrl = req.file.location;

      // Extract the S3 key from the old image URL if it exists
      if (existingSection.imageUrl) {
        const urlParts = existingSection.imageUrl.split('/');
        oldImageKey = urlParts.slice(-2).join('/'); // Get the last two parts (folder/filename)
      }
    }

    // Update the Section fields
    existingSection.page = page;
    existingSection.heading = heading;
    existingSection.subHeading = subHeading;
    existingSection.body = body;
    existingSection.orientation = orientation;
    existingSection.imageUrl = newImageUrl;

    await existingSection.save();

    // If a new image was uploaded and there was an old image, delete the old image from S3
    if (req.file && oldImageKey) {
      await deleteSingleImageFromS3(oldImageKey);
    }

    res.status(200).json({
      success: true,
      data: existingSection,
      message: 'Section updated successfully'
    });

  } catch (error) {
    // If a new image was uploaded but an error occurred, clean up the new image from S3
    if (req.file) {
      await deleteImagesFromS3([req.file]);
    }
    next(error);
  }
};

export const deleteSection = async (req, res, next) => {
  try {
    const { id } = req.params;

    // Find the Section to get the image URL before deletion
    const section = await Section.findById(id);
    if (!section) {
      return next(new ErrorResponse('Section not found', 404));
    }

    // Extract the S3 key from the image URL
    let imageKey = null;
    if (section.imageUrl) {
      const urlParts = section.imageUrl.split('/');
      imageKey = urlParts.slice(-2).join('/'); // Get the last two parts (folder/filename)
    }

    // Delete the Section from database
    await Section.findByIdAndDelete(id);

    // Delete the image from S3 if it exists
    if (imageKey) {
      await deleteSingleImageFromS3(imageKey);
    }

    res.status(200).json({
      success: true,
      message: 'Section deleted successfully'
    });

  } catch (error) {
    next(error);
  }
};

// Get all Sections entries (for admin dashboard)
export const getAllSections = async (req, res, next) => {
  try {
    const sectionEntries = await Section.find().sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      data: sectionEntries
    });
  } catch (error) {
    next(error);
  }
};

// Get Section by ID (for admin editing)
export const getSectionById = async (req, res, next) => {
  try {
    const { id } = req.params;

    const section = await Section.findById(id);
    if (!section) {
      return next(new ErrorResponse('Section not found', 404));
    }

    res.status(200).json({
      success: true,
      data: section
    });
  } catch (error) {
    next(error);
  }
};

// ReferredBy Admin Functions

// Add a new referred by entry
export const addReferredBy = async (req, res, next) => {
  try {
    const { name } = req.body;

    // Validate required fields
    if (!name) {
      return next(new ErrorResponse('Name is required', 400));
    }

    // Check if a ReferredBy document already exists (we only want one document)
    const existingReferredBy = await ReferredBy.findOne({ name });

    if (existingReferredBy) {
      return next(new ErrorResponse('Name already exists', 400));
    }

    // If no document exists, create a new one
    const newReferredBy = new ReferredBy({
      name
    });

    await newReferredBy.save();

    res.status(201).json({
      success: true,
      data: newReferredBy,
      message: 'Referred By list created successfully'
    });

  } catch (error) {
    next(error);
  }
};

// Get all Referred By entries
export const getOneReferredBy = async (req, res, next) => {
  try {
    const { id } = req.params;
    const referredBy = await ReferredBy.findById(id);

    if (!referredBy) {
      return next(new ErrorResponse('No Referred By entry found', 404));
    }

    res.status(200).json({
      success: true,
      data: referredBy
    });
  } catch (error) {
    next(error);
  }
};

// Update Referred By list
export const updateReferredBy = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { name } = req.body;

    // Validate required fields
    if (!name) {
      return next(new ErrorResponse('Name is required', 400));
    }

    const updatedReferredBy = await ReferredBy.findByIdAndUpdate(
      id,
      { name },
      { new: true, runValidators: true }
    );

    res.status(200).json({
      success: true,
      data: updatedReferredBy,
      message: 'Referred By Name updated successfully'
    });
  } catch (error) {
    next(error);
  }
};

// Delete Referred By list
export const deleteReferredBy = async (req, res, next) => {
  try {
    const { id } = req.params;

    const deletedReferredBy = await ReferredBy.findByIdAndDelete(id);

    if (!deletedReferredBy) {
      return next(new ErrorResponse('Referred By Name not found', 404));
    }

    res.status(200).json({
      success: true,
      message: 'Referred By Name deleted successfully'
    });
  } catch (error) {
    next(error);
  }
};

import mongoose from "mongoose";
import { Parser } from "json2csv";
import archiver from "archiver";
import Donation from "../models/Donation.js";
import Leadership from "../models/Leadership.js";

export const downloadBackup = async (req, res) => {
  try {
    const { format } = req.query; // json or csv
    if (!["json", "csv"].includes(format)) {
      return res.status(400).json({ message: "Invalid format" });
    }

    res.setHeader("Content-Type", "application/zip");
    res.setHeader(
      "Content-Disposition",
      `attachment; filename=backup-${Date.now()}.zip`
    );

    const archive = archiver("zip", { zlib: { level: 9 } });
    archive.pipe(res);

    const collections = await mongoose.connection.db.listCollections().toArray();

    for (const coll of collections) {
      const name = coll.name;
      const data = await mongoose.connection.db.collection(name).find().toArray();

      if (format === "json") {
        // Always append file, even if empty
        archive.append(JSON.stringify(data, null, 2), { name: `${name}.json` });
      } else if (format === "csv") {
        if (data.length > 0) {
          const parser = new Parser({ fields: Object.keys(data[0]) });
          const csv = parser.parse(data);
          archive.append(csv, { name: `${name}.csv` });
        } else {
          // Empty CSV file for empty collection
          archive.append("", { name: `${name}.csv` });
        }
      }
    }

    await archive.finalize();
  } catch (err) {
    console.error("Backup error:", err);
    if (!res.headersSent) {
      res.status(500).json({ message: "Backup failed", error: err.message });
    }
  }
};

export const getHomepageContent = async (req, res) => {

}

// V3 Dynamic Things

// CARD TESTIMONIALS
export const getAllCardTestimonials = async (req, res) => {
  try {
    const testimonials = await CardTestimonial.find()
      .sort({ display_order: 1, createdAt: -1 });
    res.json(testimonials);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch card testimonials' });
  }
};

export const createCardTestimonial = async (req, res) => {
  try {
    const { name, role, location, image, content } = req.body;
    const lastTestimonial = await CardTestimonial.findOne()
      .sort({ display_order: -1 });
    const nextOrder = lastTestimonial ? lastTestimonial.display_order + 1 : 1;
    const imageUrl = req.file ? req.file.location : null; // S3 URL if uploaded
    const testimonial = new CardTestimonial({
      name,
      role,
      location,
      image: imageUrl,
      content,
      display_order: nextOrder
    });
    await testimonial.save();
    res.status(201).json(testimonial);
  } catch (error) {
    if (req.file) {
      await deleteSingleImageFromS3(createS3KeyFromImageUrl(req.file));
      console.log("testimonials: s3 uploaded image has been deleted")
    }
    res.status(400).json({ error: 'Failed to create card testimonial' });
  }
};

export const updateCardTestimonial = async (req, res) => {
  try {
    const { id } = req.params;
    const updateData = req.body;

    // Fetch the existing testimonial to get the current image URL
    const existingTestimonial = await CardTestimonial.findById(id);
    if (!existingTestimonial) {
      if (req.file) {
        await deleteSingleImageFromS3(createS3KeyFromImageUrl(req.file));
        console.log("Update testimonials: S3 uploaded image has been deleted because the testimonial was not found.");
      }
      return res.status(404).json({ error: 'Card testimonial not found' });
    }

    // If a new image is uploaded, delete the existing image from S3
    if (req.file) {
      if (existingTestimonial.image) {
        await deleteSingleImageFromS3(createS3KeyFromImageUrl(existingTestimonial.image));
        console.log("Update testimonials: s3 Existing image has been deleted!.");
      }
      updateData.image = req.file.location; // Update image URL with the new S3 URL
    }

    // Update the testimonial in the database
    const testimonial = await CardTestimonial.findByIdAndUpdate(
      id,
      updateData,
      { new: true, runValidators: true }
    );

    res.json(testimonial);
  } catch (error) {
    console.error("Error updating card testimonial:", error);
    if (req.file) {
      await deleteSingleImageFromS3(createS3KeyFromImageUrl(req.file));
      console.log("update Testimonials: S3 uploaded image has been deleted due to an unexpected error.");
    }
    res.status(400).json({ error: 'Failed to update card testimonial' });
  }
};


export const deleteCardTestimonial = async (req, res) => {
  try {
    const { id } = req.params;
    const testimonial = await CardTestimonial.findByIdAndDelete(id);
    if (!testimonial) {
      return res.status(404).json({ error: 'Card testimonial not found' });
    }
    if (testimonial.image) {
      await deleteSingleImageFromS3(createS3KeyFromImageUrl(testimonial.image));
      console.log("delete Testimonials: S3 uploaded image has been deleted.");
    }
    res.json({ message: 'Card testimonial deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete card testimonial' });
  }
};

// VIDEO TESTIMONIALS
export const getAllVideoTestimonials = async (req, res) => {
  try {
    const testimonials = await VideoTestimonial.find()
      .sort({ display_order: 1, createdAt: -1 });
    res.json(testimonials);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch video testimonials' });
  }
};

export const createVideoTestimonial = async (req, res) => {
  try {
    const { title, description, type, duration, videoUrl, videoType, videoTag, rating } = req.body;
    const lastTestimonial = await VideoTestimonial.findOne()
      .sort({ display_order: -1 });
    const nextOrder = lastTestimonial ? lastTestimonial.display_order + 1 : 1;
    const testimonial = new VideoTestimonial({
      title,
      description,
      type,
      duration,
      videoUrl,
      videoType,
      videoTag,
      rating,
      display_order: nextOrder
    });
    await testimonial.save();
    res.status(201).json(testimonial);
  } catch (error) {
    res.status(400).json({ error: 'Failed to create video testimonial' });
  }
};

export const updateVideoTestimonial = async (req, res) => {
  try {
    const { id } = req.params;
    const updateData = req.body;
    const testimonial = await VideoTestimonial.findByIdAndUpdate(
      id,
      updateData,
      { new: true, runValidators: true }
    );
    if (!testimonial) {
      return res.status(404).json({ error: 'Video testimonial not found' });
    }
    res.json(testimonial);
  } catch (error) {
    res.status(400).json({ error: 'Failed to update video testimonial' });
  }
};

export const deleteVideoTestimonial = async (req, res) => {
  try {
    const { id } = req.params;
    const testimonial = await VideoTestimonial.findByIdAndDelete(id);
    if (!testimonial) {
      return res.status(404).json({ error: 'Video testimonial not found' });
    }
    res.json({ message: 'Video testimonial deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete video testimonial' });
  }
};

// REORDER FUNCTIONALITY
export const reorderTestimonials = async (req, res) => {
  try {
    const { type, items } = req.body; // type: 'cards' or 'videos', items: [{id, display_order}]
    if (!type || !items || !Array.isArray(items)) {
      return res.status(400).json({ error: 'Invalid reorder data' });
    }
    const Model = type === 'cards' ? CardTestimonial : VideoTestimonial;
    const updatePromises = items.map(item =>
      Model.findByIdAndUpdate(item.id, { display_order: item.display_order })
    );
    await Promise.all(updatePromises);
    res.json({ message: 'Testimonials reordered successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to reorder testimonials' });
  }
};

// FEATURED STORIES
export const getAllFeaturedStories = async (req, res) => {
  try {
    const stories = await FeaturedStory.find({ is_active: true })
      .sort({ display_order: 1, createdAt: -1 });
    res.json(stories);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch featured stories' });
  }
};

export const createFeaturedStory = async (req, res) => {
  try {
    const { heading, subHeading, story } = req.body;
    
    // Validation
    if (!heading || !subHeading || !story) {
      return res.status(400).json({ error: 'Heading, subHeading, and story are required' });
    }
    
    if (heading.length > 200) {
      return res.status(400).json({ error: 'Heading must be less than 200 characters' });
    }
    
    if (subHeading.length > 300) {
      return res.status(400).json({ error: 'SubHeading must be less than 300 characters' });
    }
    
    if (story.length > 5000) {
      return res.status(400).json({ error: 'Story must be less than 5000 characters' });
    }
    
    const lastStory = await FeaturedStory.findOne()
      .sort({ display_order: -1 });
    const nextOrder = lastStory ? lastStory.display_order + 1 : 1;
    
    const featuredStory = new FeaturedStory({
      heading: heading.trim(),
      subHeading: subHeading.trim(),
      story: story.trim(),
      display_order: nextOrder
    });
    
    await featuredStory.save();
    res.status(201).json(featuredStory);
  } catch (error) {
    console.error('Error creating featured story:', error);
    res.status(400).json({ error: 'Failed to create featured story', details: error.message });
  }
};

export const updateFeaturedStory = async (req, res) => {
  try {
    const { id } = req.params;
    const { heading, subHeading, story } = req.body;
    
    // Validation
    if (heading && heading.length > 200) {
      return res.status(400).json({ error: 'Heading must be less than 200 characters' });
    }
    
    if (subHeading && subHeading.length > 300) {
      return res.status(400).json({ error: 'SubHeading must be less than 300 characters' });
    }
    
    if (story && story.length > 5000) {
      return res.status(400).json({ error: 'Story must be less than 5000 characters' });
    }
    
    const updateData = {};
    if (heading !== undefined) updateData.heading = heading.trim();
    if (subHeading !== undefined) updateData.subHeading = subHeading.trim();
    if (story !== undefined) updateData.story = story.trim();
    
    const featuredStory = await FeaturedStory.findByIdAndUpdate(
      id,
      updateData,
      { new: true, runValidators: true }
    );
    
    if (!featuredStory) {
      return res.status(404).json({ error: 'Featured story not found' });
    }
    
    res.json(featuredStory);
  } catch (error) {
    console.error('Error updating featured story:', error);
    res.status(400).json({ error: 'Failed to update featured story', details: error.message });
  }
};

export const deleteFeaturedStory = async (req, res) => {
  try {
    const { id } = req.params;
    const featuredStory = await FeaturedStory.findByIdAndDelete(id);
    if (!featuredStory) {
      return res.status(404).json({ error: 'Featured story not found' });
    }
    res.json({ message: 'Featured story deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete featured story' });
  }
};

// LEADERSHIP
// Get all leadership members (admin)
export const getAllLeadership = async (req, res) => {
  try {
    const members = await Leadership.find()
      .sort({ category: 1, display_order: 1 })
      .lean();

    res.status(200).json({
      success: true,
      data: members,
      count: members.length
    });
  } catch (error) {
    console.error('Error fetching leadership members:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch leadership members',
      error: error.message
    });
  }
};

// Get single leadership member (admin)
export const getLeadershipById = async (req, res) => {
  try {
    const { id } = req.params;

    if (!validator.isMongoId(id)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid member ID'
      });
    }

    const member = await Leadership.findById(id);

    if (!member) {
      return res.status(404).json({
        success: false,
        message: 'Leadership member not found'
      });
    }

    res.status(200).json({
      success: true,
      data: member
    });
  } catch (error) {
    console.error('Error fetching leadership member:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch leadership member',
      error: error.message
    });
  }
};

// Create new leadership member
export const createLeadership = async (req, res) => {
  try {
    const { name, title, description, category, fullBio, hasImage } = req.body;

    // Validation using validator module
    const errors = [];

    if (!name || !validator.isLength(name.trim(), { min: 1, max: 100 })) {
      errors.push('Name is required and must be between 1-100 characters');
    }

    if (!title || !validator.isLength(title.trim(), { min: 1, max: 100 })) {
      errors.push('Title is required and must be between 1-100 characters');
    }

    if (!description || !validator.isLength(description.trim(), { min: 1, max: 5000 })) {
      errors.push('Description is required and must be between 1-500 characters');
    }

    // if (!image || !validator.isURL(image)) { //enable after s3 implemented
    //   errors.push('Valid image URL is required');
    // }

    if (!category || !['directors', 'advisors', 'staff'].includes(category)) {
      errors.push('Category must be directors, advisors, or staff');
    }

    if (fullBio && !validator.isLength(fullBio.trim(), { max: 2000 })) {
      errors.push('Full bio must not exceed 2000 characters');
    }

    if (errors.length > 0) {
      if (req.file) {
        await deleteSingleImageFromS3(createS3KeyFromImageUrl(req.file));
        console.log('leadership: s3 uploaded image has been deleted!')
      }
      return res.status(400).json({
        success: false,
        message: 'Validation errors',
        errors: errors
      });
    }

    // Handle image upload (optional)
    const imageUrl = req.file ? req.file.location : null; // S3 URL if uploaded

    // Get the next display order for this category
    const lastMember = await Leadership.findOne({ category })
      .sort({ display_order: -1 });

    const display_order = lastMember ? lastMember.display_order + 1 : 1;

    const newMember = new Leadership({
      name: validator.escape(name.trim()),
      title: validator.escape(title.trim()),
      description: validator.escape(description.trim()),
      image: imageUrl,
      hasImage: hasImage !== undefined ? hasImage : true,
      category,
      display_order,
      fullBio: fullBio ? validator.escape(fullBio.trim()) : '',
      is_active: true
    });

    await newMember.save();

    res.status(201).json({
      success: true,
      message: 'Leadership member created successfully',
      data: newMember
    });
  } catch (error) {
    console.error('Error creating leadership member:', error);
    if (req.file) {
      await deleteSingleImageFromS3(createS3KeyFromImageUrl(req.file));
      console.log('leadership: s3 uploaded image has been deleted!')
    }
    res.status(500).json({
      success: false,
      message: 'Failed to create leadership member',
      error: error.message
    });
  }
};

// Update leadership member
export const updateLeadership = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, title, description, category, fullBio, is_active, hasImage } = req.body;

    if (!validator.isMongoId(id)) {
      if (req.file) {
        await deleteSingleImageFromS3(createS3KeyFromImageUrl(req.file));
        console.log('update leadership: s3 uploaded image has been deleted!')
      }
      return res.status(400).json({
        success: false,
        message: 'Invalid member ID'
      });
    }

    // Fetch the existing member to get the current image URL
    const existingMember = await Leadership.findById(id);
    if (!existingMember) {
      if (req.file) {
        await deleteSingleImageFromS3(createS3KeyFromImageUrl(req.file));
        console.log('Update leadership: s3 Uploaded image has been deleted because the member was not found!');
      }
      return res.status(404).json({
        success: false,
        message: 'Leadership member not found',
      });
    }

    // Validation using validator module
    const errors = [];

    if (name !== undefined && (!name || !validator.isLength(name.trim(), { min: 1, max: 100 }))) {
      errors.push('Name must be between 1-100 characters');
    }

    if (title !== undefined && (!title || !validator.isLength(title.trim(), { min: 1, max: 100 }))) {
      errors.push('Title must be between 1-100 characters');
    }

    if (description !== undefined && (!description || !validator.isLength(description.trim(), { min: 1, max: 5000 }))) {
      errors.push('Description must be between 1-500 characters');
    }

    // if (image !== undefined && (!image || !validator.isURL(image))) { //enable after s3 integrated
    //   errors.push('Valid image URL is required');
    // }

    if (category !== undefined && !['directors', 'advisors', 'staff'].includes(category)) {
      errors.push('Category must be directors, advisors, or staff');
    }

    if (fullBio !== undefined && fullBio && !validator.isLength(fullBio.trim(), { max: 2000 })) {
      errors.push('Full bio must not exceed 2000 characters');
    }

    if (is_active !== undefined && typeof is_active !== 'boolean') {
      errors.push('is_active must be a boolean value');
    }

    if (errors.length > 0) {
      if (req.file) {
        await deleteSingleImageFromS3(createS3KeyFromImageUrl(req.file));
        console.log('update leadership: s3 uploaded image has been deleted!')
      }
      return res.status(400).json({
        success: false,
        message: 'Validation errors',
        errors: errors
      });
    }

    // Prepare update data
    const updateData = {};
    if (name !== undefined) updateData.name = validator.escape(name.trim());
    if (title !== undefined) updateData.title = validator.escape(title.trim());
    if (description !== undefined) updateData.description = validator.escape(description.trim());
    if (req.file) {
      // Delete the existing image from S3 if it exists
      if (existingMember.image) {
        await deleteSingleImageFromS3(createS3KeyFromImageUrl(existingMember.image));
        console.log('Update leadership: s3 Existing image has been deleted!');
      }
      updateData.image = req.file.location; // Assuming `req.file.location` contains the S3 URL
      updateData.hasImage = true;
    }
    if (hasImage !== undefined) {
      updateData.hasImage = hasImage; // Override hasImage based on the request body
    }
    if (category !== undefined) updateData.category = category;
    if (fullBio !== undefined) updateData.fullBio = fullBio ? validator.escape(fullBio.trim()) : '';
    if (is_active !== undefined) updateData.is_active = is_active;

    const member = await Leadership.findByIdAndUpdate(
      id,
      updateData,
      { new: true, runValidators: true }
    );

    if (!member) {
      if (req.file) {
        await deleteSingleImageFromS3(createS3KeyFromImageUrl(req.file));
        console.log('update leadership: s3 uploaded image has been deleted!')
      }
      return res.status(404).json({
        success: false,
        message: 'Leadership member not found'
      });
    }

    res.status(200).json({
      success: true,
      message: 'Leadership member updated successfully',
      data: member
    });
  } catch (error) {
    console.error('Error updating leadership member:', error);
    if (req.file) {
      await deleteSingleImageFromS3(createS3KeyFromImageUrl(req.file));
      console.log('update leadership: s3 uploaded image has been deleted!')
    }
    res.status(500).json({
      success: false,
      message: 'Failed to update leadership member',
      error: error.message
    });
  }
};

// Delete leadership member
export const deleteLeadership = async (req, res) => {
  try {
    const { id } = req.params;

    if (!validator.isMongoId(id)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid member ID'
      });
    }

    const member = await Leadership.findByIdAndDelete(id);

    if (!member) {
      return res.status(404).json({
        success: false,
        message: 'Leadership member not found'
      });
    }

    // Reorder remaining members in the same category
    await Leadership.updateMany(
      {
        category: member.category,
        display_order: { $gt: member.display_order }
      },
      { $inc: { display_order: -1 } }
    );

    if (member.image) {
      await deleteSingleImageFromS3(createS3KeyFromImageUrl(member.image));
      console.log('delete leadership: s3 uploaded image has been deleted!')
    }

    res.status(200).json({
      success: true,
      message: 'Leadership member deleted successfully',
      data: member
    });
  } catch (error) {
    console.error('Error deleting leadership member:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to delete leadership member',
      error: error.message
    });
  }
};

// Reorder leadership members
export const reorderLeadership = async (req, res) => {
  try {
    const { items } = req.body;

    if (!Array.isArray(items)) {
      return res.status(400).json({
        success: false,
        message: 'Items must be an array'
      });
    }

    // Validate each item
    const errors = [];
    for (let i = 0; i < items.length; i++) {
      const item = items[i];
      if (!item.id || !validator.isMongoId(item.id)) {
        errors.push(`Item ${i + 1}: Invalid member ID`);
      }
      if (typeof item.display_order !== 'number' || item.display_order < 1) {
        errors.push(`Item ${i + 1}: Invalid display order`);
      }
    }

    if (errors.length > 0) {
      return res.status(400).json({
        success: false,
        message: 'Validation errors',
        errors: errors
      });
    }

    // Update display_order for each item
    const updatePromises = items.map(item =>
      Leadership.findByIdAndUpdate(
        item.id,
        { display_order: item.display_order },
        { new: true }
      )
    );

    await Promise.all(updatePromises);

    res.status(200).json({
      success: true,
      message: 'Leadership order updated successfully'
    });
  } catch (error) {
    console.error('Error reordering leadership:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to reorder leadership members',
      error: error.message
    });
  }
};

// GET /api/admin/gallery - Get all gallery items (Admin)
export const getAllGalleryItems = async (req, res) => {
  try {
    const { category, page = 1, limit = 50 } = req.query;
    
    let query = {};
    if (category && category !== 'all') {
      query.category = category;
    }
    
    const skip = (parseInt(page) - 1) * parseInt(limit);
    
    const items = await GalleryItem.find(query)
      .sort({ display_order: 1, created_at: -1 })
      .skip(skip)
      .limit(parseInt(limit))
      .lean();
    
    const total = await GalleryItem.countDocuments(query);
    
    res.status(200).json({
      success: true,
      data: items,
      pagination: {
        current: parseInt(page),
        pages: Math.ceil(total / parseInt(limit)),
        total: total
      }
    });
  } catch (error) {
    console.error('Error fetching gallery items:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch gallery items',
      error: error.message
    });
  }
};

// GET /api/admin/gallery/:id - Get single gallery item (Admin)
export const getGalleryItemById = async (req, res) => {
  try {
    const { id } = req.params;
    
    if (!validator.isMongoId(id)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid gallery item ID'
      });
    }
    
    const item = await GalleryItem.findById(id);
    
    if (!item) {
      return res.status(404).json({
        success: false,
        message: 'Gallery item not found'
      });
    }
    
    res.status(200).json({
      success: true,
      data: item
    });
  } catch (error) {
    console.error('Error fetching gallery item:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch gallery item',
      error: error.message
    });
  }
};

// POST /api/admin/gallery - Create new gallery item (Admin)
export const createGalleryItem = async (req, res) => {
  try {
    const { title, description, category, year } = req.body;
    
    // Validation using validator package
    if (!title || !validator.isLength(title, { min: 1, max: 255 })) {
      return res.status(400).json({
        success: false,
        message: 'Title is required and must be between 1-255 characters'
      });
    }
    
    if (!description || !validator.isLength(description, { min: 1, max: 1000 })) {
      return res.status(400).json({
        success: false,
        message: 'Description is required and must be between 1-1000 characters'
      });
    }
    
    if (!category || !validator.isIn(category, ['events', 'leadership', 'partnerships', 'workshops', 'digital'])) {
      return res.status(400).json({
        success: false,
        message: 'Category is required and must be one of: events, leadership, partnerships, workshops, digital'
      });
    }
    
    if (!year || !validator.isInt(year, { min: 2000, max: 2030 })) {
      return res.status(400).json({
        success: false,
        message: 'Year is required and must be between 2000-2030'
      });
    }
    
    if (!req.file || !req.file.location) {
      return res.status(400).json({
        success: false,
        message: 'Image file is required'
      });
    }
    
    // Get the next display order for the category
    const lastItem = await GalleryItem.findOne({ category })
      .sort({ display_order: -1 });
    const nextOrder = lastItem ? lastItem.display_order + 1 : 1;

    const galleryItem = new GalleryItem({
      title: validator.escape(title.trim()),
      description: validator.escape(description.trim()),
      category,
      year: validator.escape(year.trim()),
      image: req.file.location, // S3 URL
      display_order: nextOrder
    });

    await galleryItem.save();

    res.status(201).json({
      success: true,
      message: 'Gallery item created successfully',
      data: galleryItem
    });
  } catch (error) {
    console.error('Error creating gallery item:', error);
    
    // Clean up uploaded file if database save fails
    if (req.file && req.file.key) {
      await deleteSingleImageFromS3(req.file.key);
    }
    
    res.status(500).json({
      success: false,
      message: 'Failed to create gallery item',
      error: error.message
    });
  }
};

// PUT /api/admin/gallery/:id - Update gallery item (Admin)
export const updateGalleryItem = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, description, category, year } = req.body;
    
    if (!validator.isMongoId(id)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid gallery item ID'
      });
    }
    
    // Validation using validator package
    if (title && !validator.isLength(title, { min: 1, max: 255 })) {
      return res.status(400).json({
        success: false,
        message: 'Title must be between 1-255 characters'
      });
    }
    
    if (description && !validator.isLength(description, { min: 1, max: 1000 })) {
      return res.status(400).json({
        success: false,
        message: 'Description must be between 1-1000 characters'
      });
    }
    
    if (category && !validator.isIn(category, ['events', 'leadership', 'partnerships', 'workshops', 'digital'])) {
      return res.status(400).json({
        success: false,
        message: 'Category must be one of: events, leadership, partnerships, workshops, digital'
      });
    }
    
    if (year && !validator.isInt(year, { min: 2000, max: 2030 })) {
      return res.status(400).json({
        success: false,
        message: 'Year must be between 2000-2030'
      });
    }
    
    // Get existing item to check for old image
    const existingItem = await GalleryItem.findById(id);
    if (!existingItem) {
      return res.status(404).json({
        success: false,
        message: 'Gallery item not found'
      });
    }
    
    const updateData = {
      updated_at: new Date()
    };
    
    if (title) updateData.title = validator.escape(title.trim());
    if (description) updateData.description = validator.escape(description.trim());
    if (category) updateData.category = category;
    if (year) updateData.year = validator.escape(year.trim());
    
    // Handle new image upload
    if (req.file && req.file.location) {
      updateData.image = req.file.location;
    }

    const item = await GalleryItem.findByIdAndUpdate(
      id,
      updateData,
      { new: true, runValidators: true }
    );

    // Delete old image from S3 if new image was uploaded
    if (req.file && req.file.location && existingItem.image !== req.file.location) {
      const oldImageKey = existingItem.image.split('/').slice(-2).join('/'); // Extract key from S3 URL
      await deleteSingleImageFromS3(oldImageKey);
    }

    res.status(200).json({
      success: true,
      message: 'Gallery item updated successfully',
      data: item
    });
  } catch (error) {
    console.error('Error updating gallery item:', error);
    
    // Clean up uploaded file if database update fails
    if (req.file && req.file.key) {
      await deleteSingleImageFromS3(req.file.key);
    }
    
    res.status(500).json({
      success: false,
      message: 'Failed to update gallery item',
      error: error.message
    });
  }
};

// DELETE /api/admin/gallery/:id - Delete gallery item (Admin)
export const deleteGalleryItem = async (req, res) => {
  try {
    const { id } = req.params;
    
    if (!validator.isMongoId(id)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid gallery item ID'
      });
    }
    
    const item = await GalleryItem.findById(id);
    
    if (!item) {
      return res.status(404).json({
        success: false,
        message: 'Gallery item not found'
      });
    }
    
    // Delete image from S3
    if (item.image) {
      const imageKey = item.image.split('/').slice(-2).join('/'); // Extract key from S3 URL
      await deleteSingleImageFromS3(imageKey);
    }
    
    await GalleryItem.findByIdAndDelete(id);

    res.status(200).json({
      success: true,
      message: 'Gallery item deleted successfully'
    });
  } catch (error) {
    console.error('Error deleting gallery item:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to delete gallery item',
      error: error.message
    });
  }
};

// PUT /api/admin/gallery/reorder - Reorder gallery items (Admin)
export const reorderGalleryItems = async (req, res) => {
  try {
    const { items } = req.body;
    
    if (!Array.isArray(items)) {
      return res.status(400).json({
        success: false,
        message: 'Items must be an array'
      });
    }
    
    // Validate each item in the array
    for (const item of items) {
      if (!item.id || !validator.isMongoId(item.id.toString())) {
        return res.status(400).json({
          success: false,
          message: 'Invalid item ID in reorder array'
        });
      }
      
      if (typeof item.display_order !== 'number' || item.display_order < 0) {
        return res.status(400).json({
          success: false,
          message: 'Display order must be a non-negative number'
        });
      }
    }

    // Update display order for each item
    const updatePromises = items.map(item => 
      GalleryItem.findByIdAndUpdate(
        item.id,
        { display_order: item.display_order },
        { new: true }
      )
    );

    await Promise.all(updatePromises);

    res.status(200).json({
      success: true,
      message: 'Gallery items reordered successfully'
    });
  } catch (error) {
    console.error('Error reordering gallery items:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to reorder gallery items',
      error: error.message
    });
  }
};

// PUT /api/admin/gallery/:id/toggle-status - Toggle gallery item status (Admin)
export const toggleGalleryItemStatus = async (req, res) => {
  try {
    const { id } = req.params;
    
    if (!validator.isMongoId(id)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid gallery item ID'
      });
    }
    
    const item = await GalleryItem.findById(id);
    
    if (!item) {
      return res.status(404).json({
        success: false,
        message: 'Gallery item not found'
      });
    }
    
    item.is_active = !item.is_active;
    await item.save();

    res.status(200).json({
      success: true,
      message: `Gallery item ${item.is_active ? 'activated' : 'deactivated'} successfully`,
      data: item
    });
  } catch (error) {
    console.error('Error toggling gallery item status:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to toggle gallery item status',
      error: error.message
    });
  }
};

// @desc    Get all partner institutions (Admin)
// @route   GET /api/admin/partner-institution
// @access  Private/Admin
export const getAllPartnerInstitutions = async (req, res) => {
  try {
    const institutions = await PartnerInstitution.find()
      .sort({ display_order: 1, createdAt: -1 });
    
    res.status(200).json({
      success: true,
      data: institutions
    });
  } catch (error) {
    console.error('Error fetching partner institutions:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch partner institutions'
    });
  }
};

// @desc    Get single partner institution by ID (Admin)
// @route   GET /api/admin/partner-institution/:id
// @access  Private/Admin
export const getPartnerInstitutionById = async (req, res) => {
  try {
    const institution = await PartnerInstitution.findById(req.params.id);
    
    if (!institution) {
      return res.status(404).json({
        success: false,
        message: 'Partner institution not found'
      });
    }
    
    res.status(200).json({
      success: true,
      data: institution
    });
  } catch (error) {
    console.error('Error fetching partner institution:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch partner institution'
    });
  }
};

// @desc    Create new partner institution
// @route   POST /api/admin/partner-institution
// @access  Private/Admin
export const createPartnerInstitution = async (req, res) => {
  try {
    const {
      name,
      shortName,
      location,
      address,
      website,
      facebook,
      shortDescription,
      about,
      foundingStory,
      challenges,
      neieaImpact,
      additionalInfo,
      totalStudents,
      established
    } = req.body;

    // Validate required fields
    if (!name || !shortName || !location || !shortDescription || !totalStudents || !established) {
      return res.status(400).json({
        success: false,
        message: 'Please provide all required fields'
      });
    }

    // Check for images
    if (!req.files || !req.files.featuredImage || !req.files.detailImages) {
      return res.status(400).json({
        success: false,
        message: 'Featured image and detail images are required'
      });
    }

    const featuredImage = req.files.featuredImage[0];
    const detailImages = req.files.detailImages;

    // Get the highest display_order
    const lastInstitution = await PartnerInstitution.findOne()
      .sort({ display_order: -1 });
    const display_order = lastInstitution ? lastInstitution.display_order + 1 : 1;

    // Create institution
    const institution = await PartnerInstitution.create({
      name,
      shortName,
      location,
      address,
      website,
      facebook,
      featuredImage: featuredImage.location,
      featuredImageKey: featuredImage.key,
      detailImages: detailImages.map(img => img.location),
      detailImageKeys: detailImages.map(img => img.key),
      shortDescription,
      about,
      foundingStory,
      challenges,
      neieaImpact,
      additionalInfo,
      totalStudents,
      established,
      display_order
    });

    res.status(201).json({
      success: true,
      data: institution,
      message: 'Partner institution created successfully'
    });
  } catch (error) {
    console.error('Error creating partner institution:', error);
    
    // Cleanup uploaded images on error
    if (req.files) {
      if (req.files.featuredImage) {
        await deleteSingleImageFromS3(req.files.featuredImage[0].key);
      }
      if (req.files.detailImages) {
        for (const img of req.files.detailImages) {
          await deleteSingleImageFromS3(img.key);
        }
      }
    }
    
    res.status(500).json({
      success: false,
      message: error.message || 'Failed to create partner institution'
    });
  }
};

// @desc    Update partner institution
// @route   PUT /api/admin/partner-institution/:id
// @access  Private/Admin
export const updatePartnerInstitution = async (req, res) => {
  try {
    const institution = await PartnerInstitution.findById(req.params.id);
    
    if (!institution) {
      // Cleanup uploaded images if any
      if (req.files) {
        if (req.files.featuredImage) {
          await deleteSingleImageFromS3(req.files.featuredImage[0].key);
        }
        if (req.files.detailImages) {
          for (const img of req.files.detailImages) {
            await deleteSingleImageFromS3(img.key);
          }
        }
      }
      
      return res.status(404).json({
        success: false,
        message: 'Partner institution not found'
      });
    }

    // ========================================
    // HANDLE DETAIL IMAGES UPDATE
    // ========================================
    
    let finalDetailImages = [];
    let finalDetailImageKeys = [];
    
    // Step 1: Parse existing images from request (images to keep)
    let existingImagesToKeep = [];
    let existingKeysToKeep = [];
    
    if (req.body.existingDetailImages) {
      try {
        const parsedExisting = JSON.parse(req.body.existingDetailImages);
        existingImagesToKeep = Array.isArray(parsedExisting) ? parsedExisting : [];
        
        // Get corresponding keys for images we're keeping
        existingKeysToKeep = existingImagesToKeep.map(url => {
          const index = institution.detailImages.indexOf(url);
          return index !== -1 ? institution.detailImageKeys[index] : null;
        }).filter(key => key !== null);
        
      } catch (e) {
        console.error('Error parsing existingDetailImages:', e);
      }
    }
    
    // Step 2: Parse images to remove
    let imagesToRemove = [];
    if (req.body.imagesToRemove) {
      try {
        const parsedRemove = JSON.parse(req.body.imagesToRemove);
        imagesToRemove = Array.isArray(parsedRemove) ? parsedRemove : [];
      } catch (e) {
        console.error('Error parsing imagesToRemove:', e);
      }
    }
    
    // Step 3: Delete images from S3 that are marked for removal
    if (imagesToRemove.length > 0) {
      for (const imageInfo of imagesToRemove) {
        if (imageInfo.key) {
          await deleteSingleImageFromS3(imageInfo.key);
          console.log('Deleted image from S3:', imageInfo.key);
        }
      }
    }
    
    // Step 4: Add existing images that we're keeping
    finalDetailImages = [...existingImagesToKeep];
    finalDetailImageKeys = [...existingKeysToKeep];
    
    // Step 5: Add new uploaded images
    if (req.files && req.files.detailImages && req.files.detailImages.length > 0) {
      const newDetailImages = req.files.detailImages;
      const newImageUrls = newDetailImages.map(img => img.location);
      const newImageKeys = newDetailImages.map(img => img.key);
      
      finalDetailImages = [...finalDetailImages, ...newImageUrls];
      finalDetailImageKeys = [...finalDetailImageKeys, ...newImageKeys];
      
      console.log('Added new images:', newImageUrls.length);
    }
    
    // Step 6: Validate that at least one detail image exists
    if (finalDetailImages.length === 0) {
      // Cleanup new uploads if validation fails
      if (req.files && req.files.detailImages) {
        for (const img of req.files.detailImages) {
          await deleteSingleImageFromS3(img.key);
        }
      }
      
      return res.status(400).json({
        success: false,
        message: 'At least one detail image is required'
      });
    }
    
    // Step 7: Update institution with final image arrays
    institution.detailImages = finalDetailImages;
    institution.detailImageKeys = finalDetailImageKeys;

    // ========================================
    // HANDLE FEATURED IMAGE UPDATE (if provided)
    // ========================================
    
    if (req.files && req.files.featuredImage) {
      const oldFeaturedImageKey = institution.featuredImageKey;
      const newFeaturedImage = req.files.featuredImage[0];
      
      institution.featuredImage = newFeaturedImage.location;
      institution.featuredImageKey = newFeaturedImage.key;
      
      // Delete old featured image
      if (oldFeaturedImageKey) {
        await deleteSingleImageFromS3(oldFeaturedImageKey);
      }
    }

    // ========================================
    // UPDATE TEXT FIELDS
    // ========================================
    
    const updateFields = [
      'name', 'shortName', 'location', 'address', 'website', 'facebook',
      'shortDescription', 'about', 'foundingStory', 'challenges',
      'neieaImpact', 'additionalInfo', 'totalStudents', 'established'
    ];

    updateFields.forEach(field => {
      if (req.body[field] !== undefined) {
        institution[field] = req.body[field];
      }
    });

    // Save changes
    await institution.save();

    res.status(200).json({
      success: true,
      data: institution,
      message: 'Partner institution updated successfully'
    });
    
  } catch (error) {
    console.error('Error updating partner institution:', error);
    
    // Cleanup new uploaded images on error
    if (req.files) {
      if (req.files.featuredImage) {
        await deleteSingleImageFromS3(req.files.featuredImage[0].key);
      }
      if (req.files.detailImages) {
        for (const img of req.files.detailImages) {
          await deleteSingleImageFromS3(img.key);
        }
      }
    }
    
    res.status(500).json({
      success: false,
      message: error.message || 'Failed to update partner institution'
    });
  }
};

// @desc    Delete partner institution
// @route   DELETE /api/admin/partner-institution/:id
// @access  Private/Admin
export const deletePartnerInstitution = async (req, res) => {
  try {
    const institution = await PartnerInstitution.findById(req.params.id);
    
    if (!institution) {
      return res.status(404).json({
        success: false,
        message: 'Partner institution not found'
      });
    }

    // Delete featured image from S3
    if (institution.featuredImageKey) {
      await deleteSingleImageFromS3(institution.featuredImageKey);
    }

    // Delete detail images from S3
    if (institution.detailImageKeys && institution.detailImageKeys.length > 0) {
      for (const key of institution.detailImageKeys) {
        await deleteSingleImageFromS3(key);
      }
    }

    await institution.deleteOne();

    res.status(200).json({
      success: true,
      message: 'Partner institution deleted successfully'
    });
  } catch (error) {
    console.error('Error deleting partner institution:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to delete partner institution'
    });
  }
};

// @desc    Reorder partner institutions
// @route   PUT /api/admin/partner-institution/reorder
// @access  Private/Admin
export const reorderPartnerInstitutions = async (req, res) => {
  try {
    const { items } = req.body;
    
    if (!items || !Array.isArray(items)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid reorder data'
      });
    }

    // Update display_order for each institution
    const updatePromises = items.map(item => 
      PartnerInstitution.findByIdAndUpdate(
        item.id,
        { display_order: item.display_order },
        { new: true }
      )
    );

    await Promise.all(updatePromises);

    res.status(200).json({
      success: true,
      message: 'Partner institutions reordered successfully'
    });
  } catch (error) {
    console.error('Error reordering partner institutions:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to reorder partner institutions'
    });
  }
};

// ============================================
// CAREER PAGE ADMIN FUNCTIONS
// ============================================

// Get career page data (Admin)
export const getCareerPageAdmin = async (req, res) => {
  try {
    const careerPage = await CareerPage.findOne({ is_active: true });
    
    if (!careerPage) {
      return res.status(404).json({
        success: false,
        message: 'Career page data not found'
      });
    }
    
    // Sort benefits by display_order, fallback to creation order if all have same order
    if (careerPage.whyWorkSection && careerPage.whyWorkSection.benefits) {
      careerPage.whyWorkSection.benefits.sort((a, b) => {
        const orderA = a.display_order || 0;
        const orderB = b.display_order || 0;
        
        // If both have same order (like 0), sort by _id to maintain consistent order
        if (orderA === orderB) {
          return a._id.toString().localeCompare(b._id.toString());
        }
        
        return orderA - orderB;
      });
    }
    
    res.status(200).json({
      success: true,
      data: careerPage
    });
  } catch (error) {
    console.error('Error fetching career page:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch career page data',
      error: error.message
    });
  }
};

// Create career page (Admin - first time setup)
export const createCareerPage = async (req, res) => {
  try {
    const {
      introduction,
      whyWorkSection,
      openingsSection,
      closingSection
    } = req.body;

    // Validation
    if (!introduction || !whyWorkSection || !openingsSection || !closingSection) {
      return res.status(400).json({
        success: false,
        message: 'All sections are required'
      });
    }

    // Validate email in openingsSection.contactInfo
    if (openingsSection.contactInfo && openingsSection.contactInfo.email) {
      if (!validator.isEmail(openingsSection.contactInfo.email)) {
        return res.status(400).json({
          success: false,
          message: 'Invalid email address in contact information'
        });
      }
    }

    // Check if career page already exists
    const existingPage = await CareerPage.findOne();
    if (existingPage) {
      return res.status(400).json({
        success: false,
        message: 'Career page already exists. Use update endpoint instead.'
      });
    }

    // Create new career page
    const newCareerPage = new CareerPage({
      introduction,
      whyWorkSection,
      openingsSection,
      closingSection
    });

    await newCareerPage.save();

    res.status(201).json({
      success: true,
      message: 'Career page created successfully',
      data: newCareerPage
    });
  } catch (error) {
    console.error('Error creating career page:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to create career page',
      error: error.message
    });
  }
};

// Update career page (Admin)
export const updateCareerPage = async (req, res) => {
  try {
    const {
      introduction,
      whyWorkSection,
      openingsSection,
      closingSection
    } = req.body;

    // Validate email if provided
    if (openingsSection?.contactInfo?.email) {
      if (!validator.isEmail(openingsSection.contactInfo.email)) {
        return res.status(400).json({
          success: false,
          message: 'Invalid email address in contact information'
        });
      }
    }

    // Find and update the active career page
    const careerPage = await CareerPage.findOneAndUpdate(
      { is_active: true },
      {
        $set: {
          introduction,
          whyWorkSection,
          openingsSection,
          closingSection
        }
      },
      {
        new: true,
        runValidators: true
      }
    );

    if (!careerPage) {
      return res.status(404).json({
        success: false,
        message: 'Career page not found. Create one first.'
      });
    }

    res.status(200).json({
      success: true,
      message: 'Career page updated successfully',
      data: careerPage
    });
  } catch (error) {
    console.error('Error updating career page:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update career page',
      error: error.message
    });
  }
};

// Update specific section (Admin)
export const updateCareerPageSection = async (req, res) => {
  try {
    const { section } = req.params;
    const sectionData = req.body;

    const validSections = ['introduction', 'whyWorkSection', 'openingsSection', 'closingSection'];
    
    if (!validSections.includes(section)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid section name'
      });
    }

    // Validate email if updating openingsSection
    if (section === 'openingsSection' && sectionData.contactInfo?.email) {
      if (!validator.isEmail(sectionData.contactInfo.email)) {
        return res.status(400).json({
          success: false,
          message: 'Invalid email address in contact information'
        });
      }
    }

    const updateObject = {};
    updateObject[section] = sectionData;

    const careerPage = await CareerPage.findOneAndUpdate(
      { is_active: true },
      { $set: updateObject },
      {
        new: true,
        runValidators: true
      }
    );

    if (!careerPage) {
      return res.status(404).json({
        success: false,
        message: 'Career page not found'
      });
    }

    res.status(200).json({
      success: true,
      message: `${section} updated successfully`,
      data: careerPage
    });
  } catch (error) {
    console.error('Error updating section:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update section',
      error: error.message
    });
  }
};

// Add benefit to whyWorkSection (Admin)
export const addCareerBenefit = async (req, res) => {
  try {
    const { icon, title, description } = req.body;

    if (!icon || !title || !description) {
      return res.status(400).json({
        success: false,
        message: 'Icon, title, and description are required'
      });
    }

    const careerPage = await CareerPage.findOneAndUpdate(
      { is_active: true },
      {
        $push: {
          'whyWorkSection.benefits': { icon, title, description }
        }
      },
      {
        new: true,
        runValidators: true
      }
    );

    if (!careerPage) {
      return res.status(404).json({
        success: false,
        message: 'Career page not found'
      });
    }

    res.status(200).json({
      success: true,
      message: 'Benefit added successfully',
      data: careerPage
    });
  } catch (error) {
    console.error('Error adding benefit:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to add benefit',
      error: error.message
    });
  }
};

// Update benefit in whyWorkSection (Admin)
export const updateCareerBenefit = async (req, res) => {
  try {
    const { benefitId } = req.params;
    const { icon, title, description } = req.body;

    if (!benefitId) {
      return res.status(400).json({
        success: false,
        message: 'Benefit ID is required'
      });
    }

    const updateFields = {};
    if (icon) updateFields['whyWorkSection.benefits.$.icon'] = icon;
    if (title) updateFields['whyWorkSection.benefits.$.title'] = title;
    if (description) updateFields['whyWorkSection.benefits.$.description'] = description;

    const careerPage = await CareerPage.findOneAndUpdate(
      { 
        is_active: true,
        'whyWorkSection.benefits._id': benefitId
      },
      {
        $set: updateFields
      },
      {
        new: true,
        runValidators: true
      }
    );

    if (!careerPage) {
      return res.status(404).json({
        success: false,
        message: 'Career page or benefit not found'
      });
    }

    res.status(200).json({
      success: true,
      message: 'Benefit updated successfully',
      data: careerPage
    });
  } catch (error) {
    console.error('Error updating benefit:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update benefit',
      error: error.message
    });
  }
};

// Delete benefit from whyWorkSection (Admin)
export const deleteCareerBenefit = async (req, res) => {
  try {
    const { benefitId } = req.params;

    if (!benefitId) {
      return res.status(400).json({
        success: false,
        message: 'Benefit ID is required'
      });
    }

    const careerPage = await CareerPage.findOneAndUpdate(
      { is_active: true },
      {
        $pull: {
          'whyWorkSection.benefits': { _id: benefitId }
        }
      },
      {
        new: true
      }
    );

    if (!careerPage) {
      return res.status(404).json({
        success: false,
        message: 'Career page not found'
      });
    }

    res.status(200).json({
      success: true,
      message: 'Benefit deleted successfully',
      data: careerPage
    });
  } catch (error) {
    console.error('Error deleting benefit:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to delete benefit',
      error: error.message
    });
  }
};

// Add job category to openingsSection (Admin)
export const addCareerJobCategory = async (req, res) => {
  try {
    const { category } = req.body;

    if (!category || !category.trim()) {
      return res.status(400).json({
        success: false,
        message: 'Category is required'
      });
    }

    const careerPage = await CareerPage.findOneAndUpdate(
      { is_active: true },
      {
        $addToSet: {
          'openingsSection.jobCategories': category.trim()
        }
      },
      {
        new: true
      }
    );

    if (!careerPage) {
      return res.status(404).json({
        success: false,
        message: 'Career page not found'
      });
    }

    res.status(200).json({
      success: true,
      message: 'Job category added successfully',
      data: careerPage
    });
  } catch (error) {
    console.error('Error adding job category:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to add job category',
      error: error.message
    });
  }
};

// Delete job category from openingsSection (Admin)
export const deleteCareerJobCategory = async (req, res) => {
  try {
    const { category } = req.params;

    if (!category) {
      return res.status(400).json({
        success: false,
        message: 'Category is required'
      });
    }

    const careerPage = await CareerPage.findOneAndUpdate(
      { is_active: true },
      {
        $pull: {
          'openingsSection.jobCategories': category
        }
      },
      {
        new: true
      }
    );

    if (!careerPage) {
      return res.status(404).json({
        success: false,
        message: 'Career page not found'
      });
    }

    res.status(200).json({
      success: true,
      message: 'Job category deleted successfully',
      data: careerPage
    });
  } catch (error) {
    console.error('Error deleting job category:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to delete job category',
      error: error.message
    });
  }
};

// Delete career page (Admin - use with caution)
export const deleteCareerPage = async (req, res) => {
  try {
    const careerPage = await CareerPage.findOneAndDelete({ is_active: true });

    if (!careerPage) {
      return res.status(404).json({
        success: false,
        message: 'Career page not found'
      });
    }

    res.status(200).json({
      success: true,
      message: 'Career page deleted successfully'
    });
  } catch (error) {
    console.error('Error deleting career page:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to delete career page',
      error: error.message
    });
  }
};

// Introduction Page Functions
export const getIntroductionPageAdmin = async (req, res) => {
  try {
    const introductionPage = await IntroductionPage.findOne({ is_active: true })
      .select('-__v')
      .lean();
    
    if (!introductionPage) {
      return res.status(404).json({
        success: false,
        message: 'Introduction page data not found'
      });
    }
    
    res.status(200).json({
      success: true,
      data: introductionPage
    });
  } catch (error) {
    console.error('Error fetching introduction page:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch introduction page data',
      error: error.message
    });
  }
};

export const createIntroductionPage = async (req, res) => {
  try {
    const { visionMissionSection, registrationSection } = req.body;

    // Check if introduction page already exists
    const existingPage = await IntroductionPage.findOne({ is_active: true });
    if (existingPage) {
      return res.status(400).json({
        success: false,
        message: 'Introduction page already exists. Use update instead.'
      });
    }

    const introductionPage = await IntroductionPage.create({
      visionMissionSection,
      registrationSection
    });

    res.status(201).json({
      success: true,
      data: introductionPage,
      message: 'Introduction page created successfully'
    });
  } catch (error) {
    console.error('Error creating introduction page:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to create introduction page',
      error: error.message
    });
  }
};

export const updateIntroductionPage = async (req, res) => {
  try {
    const { visionMissionSection, registrationSection } = req.body;

    let introductionPage = await IntroductionPage.findOne({ is_active: true });

    if (!introductionPage) {
      // Create new if doesn't exist
      introductionPage = await IntroductionPage.create({
        visionMissionSection,
        registrationSection
      });
    } else {
      // Update existing
      introductionPage.visionMissionSection = visionMissionSection;
      introductionPage.registrationSection = registrationSection;
      await introductionPage.save();
    }

    res.status(200).json({
      success: true,
      data: introductionPage,
      message: 'Introduction page updated successfully'
    });
  } catch (error) {
    console.error('Error updating introduction page:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update introduction page',
      error: error.message
    });
  }
};

export const deleteIntroductionPage = async (req, res) => {
  try {
    const introductionPage = await IntroductionPage.findOne({ is_active: true });
    
    if (!introductionPage) {
      return res.status(404).json({
        success: false,
        message: 'Introduction page not found'
      });
    }

    await IntroductionPage.findByIdAndDelete(introductionPage._id);

    res.status(200).json({
      success: true,
      message: 'Introduction page deleted successfully'
    });
  } catch (error) {
    console.error('Error deleting introduction page:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to delete introduction page',
      error: error.message
    });
  }
};

// ============================================
// ELEMENTARY MIDDLE SCHOOL PAGE ADMIN FUNCTIONS
// ============================================

export const getElementaryMiddleSchoolPageAdmin = async (req, res) => {
  try {
    const page = await ElementaryMiddleSchoolPage.findOne({ is_active: true })
      .select('-__v')
      .lean();
    
    if (!page) {
      return res.status(404).json({
        success: false,
        message: 'Elementary Middle School page data not found'
      });
    }
    
    // Sort arrays by display_order
    if (page.structuralChallengesSection && page.structuralChallengesSection.challenges) {
      page.structuralChallengesSection.challenges.sort((a, b) => {
        const orderA = a.display_order || 0;
        const orderB = b.display_order || 0;
        if (orderA === orderB) {
          return a._id.toString().localeCompare(b._id.toString());
        }
        return orderA - orderB;
      });
    }
    
    if (page.neieaResponseSection && page.neieaResponseSection.responses) {
      page.neieaResponseSection.responses.sort((a, b) => {
        const orderA = a.display_order || 0;
        const orderB = b.display_order || 0;
        if (orderA === orderB) {
          return a._id.toString().localeCompare(b._id.toString());
        }
        return orderA - orderB;
      });
    }
    
    if (page.programsSection && page.programsSection.programs) {
      page.programsSection.programs.sort((a, b) => {
        const orderA = a.display_order || 0;
        const orderB = b.display_order || 0;
        if (orderA === orderB) {
          return a._id.toString().localeCompare(b._id.toString());
        }
        return orderA - orderB;
      });
    }
    
    if (page.testimonialsSection && page.testimonialsSection.testimonials) {
      page.testimonialsSection.testimonials.sort((a, b) => {
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
    console.error('Error fetching elementary middle school page:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch elementary middle school page data',
      error: error.message
    });
  }
};

export const createElementaryMiddleSchoolPage = async (req, res) => {
  try {
    const {
      heroSection,
      introduction,
      whyThisWorkMattersSection,
      structuralChallengesSection,
      neieaResponseSection,
      programsSection,
      reachImpactSection,
      testimonialsSection,
      modeOfDeliverySection
    } = req.body;

    // Check if page already exists
    const existingPage = await ElementaryMiddleSchoolPage.findOne({ is_active: true });
    if (existingPage) {
      return res.status(400).json({
        success: false,
        message: 'Elementary Middle School page already exists. Use update instead.'
      });
    }

    const newPage = await ElementaryMiddleSchoolPage.create({
      heroSection,
      introduction,
      whyThisWorkMattersSection,
      structuralChallengesSection,
      neieaResponseSection,
      programsSection,
      reachImpactSection,
      testimonialsSection,
      modeOfDeliverySection
    });

    res.status(201).json({
      success: true,
      message: 'Elementary Middle School page created successfully',
      data: newPage
    });
  } catch (error) {
    console.error('Error creating elementary middle school page:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to create elementary middle school page',
      error: error.message
    });
  }
};

export const updateElementaryMiddleSchoolPage = async (req, res) => {
  try {
    const {
      heroSection,
      introduction,
      whyThisWorkMattersSection,
      structuralChallengesSection,
      neieaResponseSection,
      programsSection,
      reachImpactSection,
      testimonialsSection,
      modeOfDeliverySection
    } = req.body;

    let page = await ElementaryMiddleSchoolPage.findOne({ is_active: true });

    if (!page) {
      // Create new if doesn't exist
      page = await ElementaryMiddleSchoolPage.create({
        heroSection,
        introduction,
        whyThisWorkMattersSection,
        structuralChallengesSection,
        neieaResponseSection,
        programsSection,
        reachImpactSection,
        testimonialsSection,
        modeOfDeliverySection
      });
    } else {
      // Update existing
      if (heroSection) page.heroSection = heroSection;
      if (introduction) page.introduction = introduction;
      if (whyThisWorkMattersSection) page.whyThisWorkMattersSection = whyThisWorkMattersSection;
      if (structuralChallengesSection) page.structuralChallengesSection = structuralChallengesSection;
      if (neieaResponseSection) page.neieaResponseSection = neieaResponseSection;
      if (programsSection) page.programsSection = programsSection;
      if (reachImpactSection) page.reachImpactSection = reachImpactSection;
      if (testimonialsSection) page.testimonialsSection = testimonialsSection;
      if (modeOfDeliverySection) page.modeOfDeliverySection = modeOfDeliverySection;
      await page.save();
    }

    res.status(200).json({
      success: true,
      message: 'Elementary Middle School page updated successfully',
      data: page
    });
  } catch (error) {
    console.error('Error updating elementary middle school page:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update elementary middle school page',
      error: error.message
    });
  }
};

export const reorderElementaryMiddleSchoolItems = async (req, res) => {
  try {
    const { section, items } = req.body;

    const validSections = ['challenges', 'responses', 'programs', 'testimonials'];
    
    if (!validSections.includes(section)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid section. Must be one of: challenges, responses, programs, testimonials'
      });
    }

    if (!items || !Array.isArray(items)) {
      return res.status(400).json({
        success: false,
        message: 'Items array is required'
      });
    }

    const page = await ElementaryMiddleSchoolPage.findOne({ is_active: true });
    
    if (!page) {
      return res.status(404).json({
        success: false,
        message: 'Elementary Middle School page not found'
      });
    }

    // Update display_order for each item
    for (const item of items) {
      const updateField = 
        section === 'challenges' ? 'structuralChallengesSection.challenges' :
        section === 'responses' ? 'neieaResponseSection.responses' :
        section === 'programs' ? 'programsSection.programs' :
        'testimonialsSection.testimonials';

      await ElementaryMiddleSchoolPage.updateOne(
        { 
          _id: page._id,
          [`${updateField}._id`]: item.id
        },
        {
          $set: {
            [`${updateField}.$.display_order`]: item.display_order
          }
        }
      );
    }

    const updatedPage = await ElementaryMiddleSchoolPage.findById(page._id);

    res.status(200).json({
      success: true,
      message: `${section} order updated successfully`,
      data: updatedPage
    });
  } catch (error) {
    console.error('Error reordering items:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to reorder items',
      error: error.message
    });
  }
};

export const uploadElementaryMiddleSchoolReachImage = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: 'Image file is required'
      });
    }

    const imageUrl = req.file.location;

    const page = await ElementaryMiddleSchoolPage.findOne({ is_active: true });

    if (!page) {
      // Delete uploaded image if page doesn't exist
      await deleteSingleImageFromS3(req.file.key);
      return res.status(404).json({
        success: false,
        message: 'Elementary Middle School page not found. Create page first.'
      });
    }

    // Delete old image if exists
    if (page.reachImpactSection?.currentReach?.image) {
      const oldImageKey = createS3KeyFromImageUrl(page.reachImpactSection.currentReach.image);
      await deleteSingleImageFromS3(oldImageKey);
    }

    // Update page with new image
    if (!page.reachImpactSection) {
      page.reachImpactSection = {};
    }
    if (!page.reachImpactSection.currentReach) {
      page.reachImpactSection.currentReach = {};
    }
    page.reachImpactSection.currentReach.image = imageUrl;
    await page.save();

    res.status(200).json({
      success: true,
      message: 'Reach image uploaded successfully',
      data: {
        image: imageUrl
      }
    });
  } catch (error) {
    if (req.file) {
      await deleteSingleImageFromS3(req.file.key);
    }
    console.error('Error uploading reach image:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to upload reach image',
      error: error.message
    });
  }
};

export const uploadElementaryMiddleSchoolHeroImage = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: 'Image file is required'
      });
    }

    const imageUrl = req.file.location;

    const page = await ElementaryMiddleSchoolPage.findOne({ is_active: true });

    if (!page) {
      // Delete uploaded image if page doesn't exist
      await deleteSingleImageFromS3(req.file.key);
      return res.status(404).json({
        success: false,
        message: 'Elementary Middle School page not found. Create page first.'
      });
    }

    // Delete old image if exists
    if (page.heroSection?.heroImage) {
      const oldImageKey = createS3KeyFromImageUrl(page.heroSection.heroImage);
      await deleteSingleImageFromS3(oldImageKey);
    }

    // Update only the heroImage field without triggering full document validation
    await ElementaryMiddleSchoolPage.updateOne(
      { _id: page._id },
      { $set: { 'heroSection.heroImage': imageUrl } }
    );

    res.status(200).json({
      success: true,
      message: 'Hero image uploaded successfully',
      data: {
        image: imageUrl
      }
    });
  } catch (error) {
    if (req.file) {
      await deleteSingleImageFromS3(req.file.key);
    }
    console.error('Error uploading hero image:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to upload hero image',
      error: error.message
    });
  }
};

export const uploadElementaryMiddleSchoolModeImage = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: 'Image file is required'
      });
    }

    const imageUrl = req.file.location;

    const page = await ElementaryMiddleSchoolPage.findOne({ is_active: true });

    if (!page) {
      // Delete uploaded image if page doesn't exist
      await deleteSingleImageFromS3(req.file.key);
      return res.status(404).json({
        success: false,
        message: 'Elementary Middle School page not found. Create page first.'
      });
    }

    // Delete old image if exists
    if (page.modeOfDeliverySection?.image) {
      const oldImageKey = createS3KeyFromImageUrl(page.modeOfDeliverySection.image);
      await deleteSingleImageFromS3(oldImageKey);
    }

    // Update page with new image
    page.modeOfDeliverySection.image = imageUrl;
    await page.save();

    res.status(200).json({
      success: true,
      message: 'Mode of delivery image uploaded successfully',
      data: {
        image: imageUrl
      }
    });
  } catch (error) {
    if (req.file) {
      await deleteSingleImageFromS3(req.file.key);
    }
    console.error('Error uploading mode image:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to upload mode of delivery image',
      error: error.message
    });
  }
};

export const deleteElementaryMiddleSchoolPage = async (req, res) => {
  try {
    const page = await ElementaryMiddleSchoolPage.findOne({ is_active: true });
    
    if (!page) {
      return res.status(404).json({
        success: false,
        message: 'Elementary Middle School page not found'
      });
    }

    // Delete images from S3
    if (page.heroSection?.heroImage) {
      const imageKey = createS3KeyFromImageUrl(page.heroSection.heroImage);
      await deleteSingleImageFromS3(imageKey);
    }
    
    if (page.reachImpactSection?.currentReach?.image) {
      const imageKey = createS3KeyFromImageUrl(page.reachImpactSection.currentReach.image);
      await deleteSingleImageFromS3(imageKey);
    }
    
    if (page.modeOfDeliverySection?.image) {
      const imageKey = createS3KeyFromImageUrl(page.modeOfDeliverySection.image);
      await deleteSingleImageFromS3(imageKey);
    }

    await ElementaryMiddleSchoolPage.findByIdAndDelete(page._id);

    res.status(200).json({
      success: true,
      message: 'Elementary Middle School page deleted successfully'
    });
  } catch (error) {
    console.error('Error deleting elementary middle school page:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to delete elementary middle school page',
      error: error.message
    });
  }
};

// ============================================
// SLUM CHILDREN PAGE ADMIN FUNCTIONS
// ============================================

export const getSlumChildrenPageAdmin = async (req, res) => {
  try {
    const page = await SlumChildrenPage.findOne({ is_active: true })
      .select('-__v')
      .lean();
    
    if (!page) {
      return res.status(404).json({
        success: false,
        message: 'Slum Children page data not found'
      });
    }
    
    // Sort arrays by display_order
    if (page.programFeaturesSection && page.programFeaturesSection.features) {
      page.programFeaturesSection.features.sort((a, b) => {
        const orderA = a.display_order || 0;
        const orderB = b.display_order || 0;
        if (orderA === orderB) {
          return a._id.toString().localeCompare(b._id.toString());
        }
        return orderA - orderB;
      });
    }
    
    if (page.challengesSection && page.challengesSection.challenges) {
      page.challengesSection.challenges.sort((a, b) => {
        const orderA = a.display_order || 0;
        const orderB = b.display_order || 0;
        if (orderA === orderB) {
          return a._id.toString().localeCompare(b._id.toString());
        }
        return orderA - orderB;
      });
    }
    
    if (page.partnershipSection && page.partnershipSection.partnerships) {
      page.partnershipSection.partnerships.sort((a, b) => {
        const orderA = a.display_order || 0;
        const orderB = b.display_order || 0;
        if (orderA === orderB) {
          return a._id.toString().localeCompare(b._id.toString());
        }
        return orderA - orderB;
      });
    }
    
    if (page.successOutcomesSection && page.successOutcomesSection.outcomes) {
      page.successOutcomesSection.outcomes.sort((a, b) => {
        const orderA = a.display_order || 0;
        const orderB = b.display_order || 0;
        if (orderA === orderB) {
          return a._id.toString().localeCompare(b._id.toString());
        }
        return orderA - orderB;
      });
    }
    
    if (page.approachSection && page.approachSection.items) {
      page.approachSection.items.sort((a, b) => {
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
    console.error('Error fetching slum children page:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch slum children page data',
      error: error.message
    });
  }
};

export const createSlumChildrenPage = async (req, res) => {
  try {
    const {
      introduction,
      programFeaturesSection,
      challengesSection,
      partnershipSection,
      successOutcomesSection,
      approachSection,
      missionStatement,
      callToActionSection
    } = req.body;

    // Check if page already exists
    const existingPage = await SlumChildrenPage.findOne({ is_active: true });
    if (existingPage) {
      return res.status(400).json({
        success: false,
        message: 'Slum Children page already exists. Use update instead.'
      });
    }

    const newPage = await SlumChildrenPage.create({
      introduction,
      programFeaturesSection,
      challengesSection,
      partnershipSection,
      successOutcomesSection,
      approachSection,
      missionStatement,
      callToActionSection
    });

    res.status(201).json({
      success: true,
      message: 'Slum Children page created successfully',
      data: newPage
    });
  } catch (error) {
    console.error('Error creating slum children page:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to create slum children page',
      error: error.message
    });
  }
};

export const updateSlumChildrenPage = async (req, res) => {
  try {
    const {
      introduction,
      programFeaturesSection,
      challengesSection,
      partnershipSection,
      successOutcomesSection,
      approachSection,
      missionStatement,
      callToActionSection
    } = req.body;

    let page = await SlumChildrenPage.findOne({ is_active: true });

    if (!page) {
      // Create new if doesn't exist
      page = await SlumChildrenPage.create({
        introduction,
        programFeaturesSection,
        challengesSection,
        partnershipSection,
        successOutcomesSection,
        approachSection,
        missionStatement,
        callToActionSection
      });
    } else {
      // Update existing
      if (introduction) page.introduction = introduction;
      if (programFeaturesSection) {
        if (programFeaturesSection.heading !== undefined) {
          page.programFeaturesSection.heading = programFeaturesSection.heading;
        }
        if (programFeaturesSection.features) {
          page.programFeaturesSection.features = programFeaturesSection.features;
        }
      }
      if (challengesSection) {
        if (challengesSection.heading !== undefined) {
          page.challengesSection.heading = challengesSection.heading;
        }
        if (challengesSection.challenges) {
          page.challengesSection.challenges = challengesSection.challenges;
        }
      }
      if (partnershipSection) {
        if (partnershipSection.heading !== undefined) {
          page.partnershipSection.heading = partnershipSection.heading;
        }
        if (partnershipSection.partnerships) {
          page.partnershipSection.partnerships = partnershipSection.partnerships;
        }
      }
      if (successOutcomesSection) {
        if (successOutcomesSection.heading !== undefined) {
          page.successOutcomesSection.heading = successOutcomesSection.heading;
        }
        if (successOutcomesSection.outcomes) {
          page.successOutcomesSection.outcomes = successOutcomesSection.outcomes;
        }
      }
      if (approachSection) {
        if (approachSection.heading !== undefined) {
          page.approachSection.heading = approachSection.heading;
        }
        if (approachSection.items) {
          page.approachSection.items = approachSection.items;
        }
      }
      if (missionStatement) page.missionStatement = missionStatement;
      if (callToActionSection) page.callToActionSection = callToActionSection;

      await page.save();
    }

    res.status(200).json({
      success: true,
      message: 'Slum Children page updated successfully',
      data: page
    });
  } catch (error) {
    console.error('Error updating slum children page:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update slum children page',
      error: error.message
    });
  }
};

export const reorderSlumChildrenItems = async (req, res) => {
  try {
    const { section, items } = req.body;

    const validSections = ['features', 'challenges', 'partnerships', 'outcomes', 'approach'];
    
    if (!validSections.includes(section)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid section. Must be one of: features, challenges, partnerships, outcomes, approach'
      });
    }

    if (!items || !Array.isArray(items)) {
      return res.status(400).json({
        success: false,
        message: 'Items array is required'
      });
    }

    const page = await SlumChildrenPage.findOne({ is_active: true });
    
    if (!page) {
      return res.status(404).json({
        success: false,
        message: 'Slum Children page not found'
      });
    }

    // Update display_order for each item
    for (const item of items) {
      const updateField = 
        section === 'features' ? 'programFeaturesSection.features' :
        section === 'challenges' ? 'challengesSection.challenges' :
        section === 'partnerships' ? 'partnershipSection.partnerships' :
        section === 'outcomes' ? 'successOutcomesSection.outcomes' :
        'approachSection.items';

      await SlumChildrenPage.updateOne(
        { 
          _id: page._id,
          [`${updateField}._id`]: item.id
        },
        {
          $set: {
            [`${updateField}.$.display_order`]: item.display_order
          }
        }
      );
    }

    const updatedPage = await SlumChildrenPage.findById(page._id);

    res.status(200).json({
      success: true,
      message: `Slum Children ${section} reordered successfully`,
      data: updatedPage
    });
  } catch (error) {
    console.error('Error reordering slum children items:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to reorder slum children items',
      error: error.message
    });
  }
};

export const uploadSlumChildrenHeroImage = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: 'Image file is required'
      });
    }

    const imageUrl = req.file.location;

    const page = await SlumChildrenPage.findOne({ is_active: true });

    if (!page) {
      // Delete uploaded image if page doesn't exist
      await deleteSingleImageFromS3(req.file.key);
      return res.status(404).json({
        success: false,
        message: 'Slum Children page not found. Create page first.'
      });
    }

    // Delete old image if exists
    if (page.introduction?.heroImage) {
      const oldImageKey = createS3KeyFromImageUrl(page.introduction.heroImage);
      await deleteSingleImageFromS3(oldImageKey);
    }

    // Update page with new image
    if (!page.introduction) {
      page.introduction = {};
    }
    page.introduction.heroImage = imageUrl;
    await page.save();

    res.status(200).json({
      success: true,
      message: 'Hero image uploaded successfully',
      data: {
        image: imageUrl
      }
    });
  } catch (error) {
    if (req.file) {
      await deleteSingleImageFromS3(req.file.key);
    }
    console.error('Error uploading hero image:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to upload hero image',
      error: error.message
    });
  }
};

export const deleteSlumChildrenPage = async (req, res) => {
  try {
    const page = await SlumChildrenPage.findOne({ is_active: true });
    
    if (!page) {
      return res.status(404).json({
        success: false,
        message: 'Slum Children page not found'
      });
    }

    // Delete hero image from S3 if exists
    if (page.introduction?.heroImage) {
      const imageKey = createS3KeyFromImageUrl(page.introduction.heroImage);
      await deleteSingleImageFromS3(imageKey);
    }

    await SlumChildrenPage.findByIdAndDelete(page._id);

    res.status(200).json({
      success: true,
      message: 'Slum Children page deleted successfully'
    });
  } catch (error) {
    console.error('Error deleting slum children page:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to delete slum children page',
      error: error.message
    });
  }
};

// ============================================
// PUBLIC GOVERNMENT SCHOOL PAGE ADMIN FUNCTIONS
// ============================================

export const getPublicGovernmentSchoolPageAdmin = async (req, res) => {
  try {
    const page = await PublicGovernmentSchoolPage.findOne({ is_active: true })
      .select('-__v')
      .lean();
    
    if (!page) {
      return res.status(404).json({
        success: false,
        message: 'Public Government School page data not found'
      });
    }
    
    // Sort arrays by display_order
    if (page.challengesSection?.challenges) {
      page.challengesSection.challenges.sort((a, b) => {
        const orderA = a.display_order || 0;
        const orderB = b.display_order || 0;
        if (orderA === orderB) {
          return a._id.toString().localeCompare(b._id.toString());
        }
        return orderA - orderB;
      });
    }
    if (page.modelSection?.models) {
      page.modelSection.models.sort((a, b) => {
        const orderA = a.display_order || 0;
        const orderB = b.display_order || 0;
        if (orderA === orderB) {
          return a._id.toString().localeCompare(b._id.toString());
        }
        return orderA - orderB;
      });
    }
    if (page.caseStudySection?.results) {
      page.caseStudySection.results.sort((a, b) => {
        const orderA = a.display_order || 0;
        const orderB = b.display_order || 0;
        if (orderA === orderB) {
          return a._id.toString().localeCompare(b._id.toString());
        }
        return orderA - orderB;
      });
    }
    if (page.pilotProjectSection?.goals) {
      page.pilotProjectSection.goals.sort((a, b) => {
        const orderA = a.display_order || 0;
        const orderB = b.display_order || 0;
        if (orderA === orderB) {
          return a._id.toString().localeCompare(b._id.toString());
        }
        return orderA - orderB;
      });
    }
    if (page.whyPartnerSection?.reasons) {
      page.whyPartnerSection.reasons.sort((a, b) => {
        const orderA = a.display_order || 0;
        const orderB = b.display_order || 0;
        if (orderA === orderB) {
          return a._id.toString().localeCompare(b._id.toString());
        }
        return orderA - orderB;
      });
    }
    if (page.callToActionSection?.actionItems) {
      page.callToActionSection.actionItems.sort((a, b) => {
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
    console.error('Error fetching public government school page:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch public government school page data',
      error: error.message
    });
  }
};

// Helper function to clean arrays by removing temporary IDs
const cleanArrayItems = (items) => {
  if (!Array.isArray(items)) return items;
  return items.map(item => {
    const cleanedItem = { ...item };
    // Remove _id if it's a temporary ID (starts with "temp-")
    if (cleanedItem._id && typeof cleanedItem._id === 'string' && cleanedItem._id.startsWith('temp-')) {
      delete cleanedItem._id;
    }
    return cleanedItem;
  });
};

export const createPublicGovernmentSchoolPage = async (req, res) => {
  try {
    const {
      heroSection,
      introductionSection,
      blendedLearningSection,
      challengesSection,
      modelSection,
      caseStudySection,
      pilotProjectSection,
      whyPartnerSection,
      callToActionSection
    } = req.body;

    // Check if page already exists
    const existingPage = await PublicGovernmentSchoolPage.findOne({ is_active: true });
    if (existingPage) {
      return res.status(400).json({
        success: false,
        message: 'Public Government School page already exists. Use update instead.'
      });
    }

    // Clean arrays to remove temporary IDs
    const cleanedData = {
      heroSection,
      introductionSection,
      blendedLearningSection,
      challengesSection: challengesSection ? {
        ...challengesSection,
        challenges: cleanArrayItems(challengesSection.challenges)
      } : challengesSection,
      modelSection: modelSection ? {
        ...modelSection,
        models: cleanArrayItems(modelSection.models)
      } : modelSection,
      caseStudySection: caseStudySection ? {
        ...caseStudySection,
        results: cleanArrayItems(caseStudySection.results)
      } : caseStudySection,
      pilotProjectSection: pilotProjectSection ? {
        ...pilotProjectSection,
        goals: cleanArrayItems(pilotProjectSection.goals)
      } : pilotProjectSection,
      whyPartnerSection: whyPartnerSection ? {
        ...whyPartnerSection,
        reasons: cleanArrayItems(whyPartnerSection.reasons)
      } : whyPartnerSection,
      callToActionSection: callToActionSection ? {
        ...callToActionSection,
        actionItems: cleanArrayItems(callToActionSection.actionItems)
      } : callToActionSection
    };

    const newPage = await PublicGovernmentSchoolPage.create(cleanedData);

    res.status(201).json({
      success: true,
      message: 'Public Government School page created successfully',
      data: newPage
    });
  } catch (error) {
    console.error('Error creating public government school page:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to create public government school page',
      error: error.message
    });
  }
};

export const updatePublicGovernmentSchoolPage = async (req, res) => {
  try {
    const {
      heroSection,
      introductionSection,
      blendedLearningSection,
      challengesSection,
      modelSection,
      caseStudySection,
      pilotProjectSection,
      whyPartnerSection,
      callToActionSection
    } = req.body;

    let page = await PublicGovernmentSchoolPage.findOne({ is_active: true });

    if (!page) {
      // Create new if doesn't exist - clean arrays to remove temporary IDs
      const cleanedData = {
        heroSection,
        introductionSection,
        blendedLearningSection,
        challengesSection: challengesSection ? {
          ...challengesSection,
          challenges: cleanArrayItems(challengesSection.challenges)
        } : challengesSection,
        modelSection: modelSection ? {
          ...modelSection,
          models: cleanArrayItems(modelSection.models)
        } : modelSection,
        caseStudySection: caseStudySection ? {
          ...caseStudySection,
          results: cleanArrayItems(caseStudySection.results)
        } : caseStudySection,
        pilotProjectSection: pilotProjectSection ? {
          ...pilotProjectSection,
          goals: cleanArrayItems(pilotProjectSection.goals)
        } : pilotProjectSection,
        whyPartnerSection: whyPartnerSection ? {
          ...whyPartnerSection,
          reasons: cleanArrayItems(whyPartnerSection.reasons)
        } : whyPartnerSection,
        callToActionSection: callToActionSection ? {
          ...callToActionSection,
          actionItems: cleanArrayItems(callToActionSection.actionItems)
        } : callToActionSection
      };
      page = await PublicGovernmentSchoolPage.create(cleanedData);
    } else {
      // Update existing - clean arrays to remove temporary IDs
      if (heroSection) page.heroSection = heroSection;
      if (introductionSection) page.introductionSection = introductionSection;
      if (blendedLearningSection) page.blendedLearningSection = blendedLearningSection;
      if (challengesSection) {
        if (challengesSection.heading !== undefined) {
          page.challengesSection.heading = challengesSection.heading;
        }
        if (challengesSection.challenges) {
          page.challengesSection.challenges = cleanArrayItems(challengesSection.challenges);
        }
      }
      if (modelSection) {
        if (modelSection.heading !== undefined) {
          page.modelSection.heading = modelSection.heading;
        }
        if (modelSection.introText !== undefined) {
          page.modelSection.introText = modelSection.introText;
        }
        if (modelSection.models) {
          page.modelSection.models = cleanArrayItems(modelSection.models);
        }
      }
      if (caseStudySection) {
        if (caseStudySection.heading !== undefined) {
          page.caseStudySection.heading = caseStudySection.heading;
        }
        if (caseStudySection.description !== undefined) {
          page.caseStudySection.description = caseStudySection.description;
        }
        if (caseStudySection.results) {
          page.caseStudySection.results = cleanArrayItems(caseStudySection.results);
        }
      }
      if (pilotProjectSection) {
        if (pilotProjectSection.heading !== undefined) {
          page.pilotProjectSection.heading = pilotProjectSection.heading;
        }
        if (pilotProjectSection.description !== undefined) {
          page.pilotProjectSection.description = pilotProjectSection.description;
        }
        if (pilotProjectSection.proposalHeading !== undefined) {
          page.pilotProjectSection.proposalHeading = pilotProjectSection.proposalHeading;
        }
        if (pilotProjectSection.proposalDescription !== undefined) {
          page.pilotProjectSection.proposalDescription = pilotProjectSection.proposalDescription;
        }
        if (pilotProjectSection.stats) {
          page.pilotProjectSection.stats = pilotProjectSection.stats;
        }
        if (pilotProjectSection.coordinatorInfo !== undefined) {
          page.pilotProjectSection.coordinatorInfo = pilotProjectSection.coordinatorInfo;
        }
        if (pilotProjectSection.goals) {
          page.pilotProjectSection.goals = cleanArrayItems(pilotProjectSection.goals);
        }
      }
      if (whyPartnerSection) {
        if (whyPartnerSection.heading !== undefined) {
          page.whyPartnerSection.heading = whyPartnerSection.heading;
        }
        if (whyPartnerSection.reasons) {
          page.whyPartnerSection.reasons = cleanArrayItems(whyPartnerSection.reasons);
        }
      }
      if (callToActionSection) {
        if (callToActionSection.heading !== undefined) {
          page.callToActionSection.heading = callToActionSection.heading;
        }
        if (callToActionSection.description !== undefined) {
          page.callToActionSection.description = callToActionSection.description;
        }
        if (callToActionSection.actionItems) {
          page.callToActionSection.actionItems = cleanArrayItems(callToActionSection.actionItems);
        }
        if (callToActionSection.closingText !== undefined) {
          page.callToActionSection.closingText = callToActionSection.closingText;
        }
        if (callToActionSection.quote !== undefined) {
          page.callToActionSection.quote = callToActionSection.quote;
        }
      }
      await page.save();
    }

    res.status(200).json({
      success: true,
      message: 'Public Government School page updated successfully',
      data: page
    });
  } catch (error) {
    console.error('Error updating public government school page:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update public government school page',
      error: error.message
    });
  }
};

export const reorderPublicGovernmentSchoolItems = async (req, res) => {
  try {
    const { section, items } = req.body;

    const validSections = ['challenges', 'models', 'caseStudyResults', 'pilotGoals', 'whyPartner', 'actionItems'];
    
    if (!validSections.includes(section)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid section. Must be one of: challenges, models, caseStudyResults, pilotGoals, whyPartner, actionItems'
      });
    }

    if (!items || !Array.isArray(items)) {
      return res.status(400).json({
        success: false,
        message: 'Items array is required'
      });
    }

    const page = await PublicGovernmentSchoolPage.findOne({ is_active: true });
    
    if (!page) {
      return res.status(404).json({
        success: false,
        message: 'Public Government School page not found'
      });
    }

    // Update display_order for each item
    for (const item of items) {
      const updateField = 
        section === 'challenges' ? 'challengesSection.challenges' :
        section === 'models' ? 'modelSection.models' :
        section === 'caseStudyResults' ? 'caseStudySection.results' :
        section === 'pilotGoals' ? 'pilotProjectSection.goals' :
        section === 'whyPartner' ? 'whyPartnerSection.reasons' :
        'callToActionSection.actionItems';

      await PublicGovernmentSchoolPage.updateOne(
        { 
          _id: page._id,
          [`${updateField}._id`]: item.id
        },
        {
          $set: {
            [`${updateField}.$.display_order`]: item.display_order
          }
        }
      );
    }

    const updatedPage = await PublicGovernmentSchoolPage.findById(page._id);

    res.status(200).json({
      success: true,
      message: 'Items reordered successfully',
      data: updatedPage
    });
  } catch (error) {
    console.error('Error reordering items:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to reorder items',
      error: error.message
    });
  }
};

export const uploadPublicGovernmentSchoolHeroImage = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: 'Image file is required'
      });
    }

    const imageUrl = req.file.location;

    const page = await PublicGovernmentSchoolPage.findOne({ is_active: true });

    if (!page) {
      await deleteSingleImageFromS3(req.file.key);
      return res.status(404).json({
        success: false,
        message: 'Public Government School page not found. Create page first.'
      });
    }

    // Delete old image if exists
    if (page.heroSection?.heroImage) {
      const oldImageKey = createS3KeyFromImageUrl(page.heroSection.heroImage);
      await deleteSingleImageFromS3(oldImageKey);
    }

    // Update only the heroImage field without triggering full document validation
    await PublicGovernmentSchoolPage.updateOne(
      { _id: page._id },
      { $set: { 'heroSection.heroImage': imageUrl } }
    );

    res.status(200).json({
      success: true,
      message: 'Hero image uploaded successfully',
      data: {
        image: imageUrl
      }
    });
  } catch (error) {
    if (req.file) {
      await deleteSingleImageFromS3(req.file.key);
    }
    console.error('Error uploading hero image:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to upload hero image',
      error: error.message
    });
  }
};

export const uploadPublicGovernmentSchoolBlendedImage = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: 'Image file is required'
      });
    }

    const imageUrl = req.file.location;

    const page = await PublicGovernmentSchoolPage.findOne({ is_active: true });

    if (!page) {
      await deleteSingleImageFromS3(req.file.key);
      return res.status(404).json({
        success: false,
        message: 'Public Government School page not found. Create page first.'
      });
    }

    // Delete old image if exists
    if (page.blendedLearningSection?.image) {
      const oldImageKey = createS3KeyFromImageUrl(page.blendedLearningSection.image);
      await deleteSingleImageFromS3(oldImageKey);
    }

    await PublicGovernmentSchoolPage.updateOne(
      { _id: page._id },
      { $set: { 'blendedLearningSection.image': imageUrl } }
    );

    res.status(200).json({
      success: true,
      message: 'Blended learning image uploaded successfully',
      data: {
        image: imageUrl
      }
    });
  } catch (error) {
    if (req.file) {
      await deleteSingleImageFromS3(req.file.key);
    }
    console.error('Error uploading blended learning image:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to upload blended learning image',
      error: error.message
    });
  }
};

export const uploadPublicGovernmentSchoolCaseStudyImage = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: 'Image file is required'
      });
    }

    const imageUrl = req.file.location;

    const page = await PublicGovernmentSchoolPage.findOne({ is_active: true });

    if (!page) {
      await deleteSingleImageFromS3(req.file.key);
      return res.status(404).json({
        success: false,
        message: 'Public Government School page not found. Create page first.'
      });
    }

    // Delete old image if exists
    if (page.caseStudySection?.image) {
      const oldImageKey = createS3KeyFromImageUrl(page.caseStudySection.image);
      await deleteSingleImageFromS3(oldImageKey);
    }

    await PublicGovernmentSchoolPage.updateOne(
      { _id: page._id },
      { $set: { 'caseStudySection.image': imageUrl } }
    );

    res.status(200).json({
      success: true,
      message: 'Case study image uploaded successfully',
      data: {
        image: imageUrl
      }
    });
  } catch (error) {
    if (req.file) {
      await deleteSingleImageFromS3(req.file.key);
    }
    console.error('Error uploading case study image:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to upload case study image',
      error: error.message
    });
  }
};

export const uploadPublicGovernmentSchoolCaseStudyPDF = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: 'PDF file is required'
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

    const pdfUrl = req.file.location;
    const page = await PublicGovernmentSchoolPage.findOne({ is_active: true });

    if (!page) {
      await deleteSingleImageFromS3(req.file.key);
      return res.status(404).json({
        success: false,
        message: 'Public Government School page not found. Create page first.'
      });
    }

    // Store old PDF URL before updating
    const oldPdfUrl = page.caseStudySection?.pdfUrl;

    try {
      // Update PDF URL
      if (!page.caseStudySection) {
        page.caseStudySection = {};
      }
      page.caseStudySection.pdfUrl = pdfUrl;
      page.markModified('caseStudySection');
      await page.save();

      // Delete old PDF from S3 after successful database update
      if (oldPdfUrl) {
        const oldPdfKey = createS3KeyFromImageUrl(oldPdfUrl);
        if (oldPdfKey) {
          await deleteSingleImageFromS3(oldPdfKey);
        }
      }

      res.status(200).json({
        success: true,
        message: 'Case study PDF uploaded successfully',
        data: {
          pdfUrl: pdfUrl
        }
      });
    } catch (dbError) {
      // If database update fails, clean up the newly uploaded file
      console.error('Database update failed, cleaning up uploaded file:', dbError);
      await deleteSingleImageFromS3(req.file.key);
      throw dbError;
    }
  } catch (error) {
    console.error('Error uploading case study PDF:', error);
    // Ensure cleanup if file was uploaded but error occurred
    if (req.file && req.file.key) {
      try {
        await deleteSingleImageFromS3(req.file.key);
      } catch (cleanupError) {
        console.error('Error cleaning up uploaded file:', cleanupError);
      }
    }
    return res.status(500).json({
      success: false,
      message: 'Failed to upload case study PDF',
      error: error.message
    });
  }
};

export const deletePublicGovernmentSchoolPage = async (req, res) => {
  try {
    const page = await PublicGovernmentSchoolPage.findOne({ is_active: true });
    
    if (!page) {
      return res.status(404).json({
        success: false,
        message: 'Public Government School page not found'
      });
    }

    // Delete images from S3 if exists
    if (page.heroSection?.heroImage) {
      const imageKey = createS3KeyFromImageUrl(page.heroSection.heroImage);
      await deleteSingleImageFromS3(imageKey);
    }
    if (page.blendedLearningSection?.image) {
      const imageKey = createS3KeyFromImageUrl(page.blendedLearningSection.image);
      await deleteSingleImageFromS3(imageKey);
    }
    if (page.caseStudySection?.image) {
      const imageKey = createS3KeyFromImageUrl(page.caseStudySection.image);
      await deleteSingleImageFromS3(imageKey);
    }

    await PublicGovernmentSchoolPage.findByIdAndDelete(page._id);

    res.status(200).json({
      success: true,
      message: 'Public Government School page deleted successfully'
    });
  } catch (error) {
    console.error('Error deleting public government school page:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to delete public government school page',
      error: error.message
    });
  }
};

// ============================================
// OUT OF SCHOOL / DROPOUT PAGE ADMIN FUNCTIONS
// ============================================

export const getOutOfSchoolDropoutPageAdmin = async (req, res) => {
  try {
    const page = await OutOfSchoolDropoutPage.findOne({ is_active: true }).lean();
    if (!page) return res.status(404).json({ success: false, message: 'Out Of School/Dropout page data not found' });
    if (page.obeProgramSection?.programs) page.obeProgramSection.programs.sort((a,b)=> (a.display_order||0)-(b.display_order||0));
    if (page.secondaryProgramSection?.subjects) page.secondaryProgramSection.subjects.sort((a,b)=> (a.display_order||0)-(b.display_order||0));
    if (page.gallerySection?.images) page.gallerySection.images.sort((a,b)=> (a.display_order||0)-(b.display_order||0));
    if (page.impactSection?.cards) page.impactSection.cards.sort((a,b)=> (a.display_order||0)-(b.display_order||0));
    return res.status(200).json({ success: true, data: page });
  } catch (e) {
    return res.status(500).json({ success: false, message: 'Failed to fetch page', error: e.message });
  }
};



export const createOutOfSchoolDropoutPage = async (req, res) => {
  try {
    const exists = await OutOfSchoolDropoutPage.findOne({ is_active: true });
    if (exists) return res.status(400).json({ success:false, message:'Page already exists. Use update instead.'});
    const body = req.body;
    const doc = await OutOfSchoolDropoutPage.create({
      ...body,
      obeProgramSection: body.obeProgramSection ? {
        ...body.obeProgramSection,
        programs: cleanArrayItems(body.obeProgramSection.programs||[])
      } : body.obeProgramSection,
      secondaryProgramSection: body.secondaryProgramSection ? {
        ...body.secondaryProgramSection,
        subjects: cleanArrayItems(body.secondaryProgramSection.subjects||[])
      } : body.secondaryProgramSection,
      gallerySection: body.gallerySection ? {
        ...body.gallerySection,
        images: cleanArrayItems(body.gallerySection.images||[])
      } : body.gallerySection,
      impactSection: body.impactSection ? {
        ...body.impactSection,
        cards: cleanArrayItems(body.impactSection.cards||[])
      } : body.impactSection,
    });
    return res.status(201).json({ success:true, message:'Page created successfully', data: doc });
  } catch (e) {
    return res.status(500).json({ success:false, message:'Failed to create page', error: e.message });
  }
};

export const updateOutOfSchoolDropoutPage = async (req, res) => {
  try {
    let page = await OutOfSchoolDropoutPage.findOne({ is_active: true });
    const body = req.body;
    if (!page) {
      const created = await OutOfSchoolDropoutPage.create(body);
      return res.status(201).json({ success:true, data: created });
    }
    if (body.heroSection) page.heroSection = body.heroSection;
    if (body.objectiveSection) page.objectiveSection = body.objectiveSection;
    if (body.featuredImageSection) page.featuredImageSection = body.featuredImageSection;
    if (body.obeProgramSection) page.obeProgramSection = body.obeProgramSection;
    if (body.flexibleNote) page.flexibleNote = body.flexibleNote;
    if (body.secondaryProgramSection) page.secondaryProgramSection = body.secondaryProgramSection;
    if (body.gallerySection) page.gallerySection = body.gallerySection;
    if (body.impactSection) page.impactSection = body.impactSection;
    if (body.secondImageSection) page.secondImageSection = body.secondImageSection;
    await page.save();
    return res.status(200).json({ success:true, message:'Page updated successfully', data: page });
  } catch (e) {
    return res.status(500).json({ success:false, message:'Failed to update page', error: e.message });
  }
};

export const reorderOutOfSchoolDropoutItems = async (req, res) => {
  try {
    const { section, items, parent } = req.body; // parent used for nested arrays if needed
    const valid = ['obePrograms','secondarySubjects','galleryImages','impactCards'];
    if (!valid.includes(section)) return res.status(400).json({ success:false, message:'Invalid section' });
    const page = await OutOfSchoolDropoutPage.findOne({ is_active: true });
    if (!page) return res.status(404).json({ success:false, message:'Page not found' });
    for (const it of items) {
      const updateField = section === 'obePrograms' ? 'obeProgramSection.programs'
        : section === 'secondarySubjects' ? 'secondaryProgramSection.subjects'
        : section === 'galleryImages' ? 'gallerySection.images'
        : 'impactSection.cards';
      await OutOfSchoolDropoutPage.updateOne({ _id: page._id, [`${updateField}._id`]: it.id }, { $set: { [`${updateField}.$.display_order`]: it.display_order } });
    }
    const updated = await OutOfSchoolDropoutPage.findById(page._id);
    return res.status(200).json({ success:true, message:'Items reordered successfully', data: updated });
  } catch (e) {
    return res.status(500).json({ success:false, message:'Failed to reorder items', error: e.message });
  }
};

export const uploadOutOfSchoolDropoutHeroImage = async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ success:false, message:'Image file is required' });
    const page = await OutOfSchoolDropoutPage.findOne({ is_active: true });
    if (!page) { await deleteSingleImageFromS3(req.file.key); return res.status(404).json({ success:false, message:'Page not found. Create page first.'}); }
    if (page.heroSection?.heroImage) { const old = createS3KeyFromImageUrl(page.heroSection.heroImage); await deleteSingleImageFromS3(old); }
    await OutOfSchoolDropoutPage.updateOne({ _id: page._id }, { $set: { 'heroSection.heroImage': req.file.location } });
    return res.status(200).json({ success:true, data:{ image: req.file.location } });
  } catch (e) {
    if (req.file) await deleteSingleImageFromS3(req.file.key);
    return res.status(500).json({ success:false, message:'Failed to upload hero image', error: e.message });
  }
};

export const uploadOutOfSchoolDropoutFeaturedImage = async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ success:false, message:'Image file is required' });
    const page = await OutOfSchoolDropoutPage.findOne({ is_active: true });
    if (!page) { await deleteSingleImageFromS3(req.file.key); return res.status(404).json({ success:false, message:'Page not found. Create page first.'}); }
    if (page.featuredImageSection?.image) { const old = createS3KeyFromImageUrl(page.featuredImageSection.image); await deleteSingleImageFromS3(old); }
    await OutOfSchoolDropoutPage.updateOne({ _id: page._id }, { $set: { 'featuredImageSection.image': req.file.location } });
    return res.status(200).json({ success:true, data:{ image: req.file.location } });
  } catch (e) {
    if (req.file) await deleteSingleImageFromS3(req.file.key);
    return res.status(500).json({ success:false, message:'Failed to upload image', error: e.message });
  }
};

export const uploadOutOfSchoolDropoutSecondImage = async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ success:false, message:'Image file is required' });
    const page = await OutOfSchoolDropoutPage.findOne({ is_active: true });
    if (!page) { await deleteSingleImageFromS3(req.file.key); return res.status(404).json({ success:false, message:'Page not found. Create page first.'}); }
    if (page.secondImageSection?.image) { const old = createS3KeyFromImageUrl(page.secondImageSection.image); await deleteSingleImageFromS3(old); }
    await OutOfSchoolDropoutPage.updateOne({ _id: page._id }, { $set: { 'secondImageSection.image': req.file.location } });
    return res.status(200).json({ success:true, data:{ image: req.file.location } });
  } catch (e) {
    if (req.file) await deleteSingleImageFromS3(req.file.key);
    return res.status(500).json({ success:false, message:'Failed to upload image', error: e.message });
  }
};

export const uploadOutOfSchoolDropoutGalleryImage = async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ success:false, message:'Image file is required' });
    
    // Get old image URL from request body if provided
    const oldImageUrl = req.body.oldImageUrl;
    
    // Delete old image from S3 if it exists
    if (oldImageUrl && oldImageUrl.trim() !== '') {
      try {
        const oldImageKey = createS3KeyFromImageUrl(oldImageUrl);
        if (oldImageKey) {
          await deleteSingleImageFromS3(oldImageKey);
          console.log('Successfully deleted old gallery image from S3:', oldImageKey);
        }
      } catch (deleteError) {
        console.error('Error deleting old gallery image from S3:', deleteError);
        // Continue even if deletion fails - the new file is already uploaded
      }
    }
    
    // Return the new image URL - the frontend will handle adding it to the gallery array
    return res.status(200).json({ success:true, data:{ image: req.file.location } });
  } catch (e) {
    if (req.file) await deleteSingleImageFromS3(req.file.key);
    return res.status(500).json({ success:false, message:'Failed to upload gallery image', error: e.message });
  }
};

// ============================================
// NEI USA INTRODUCTION PAGE ADMIN FUNCTIONS
// ============================================

export const getNeiUsaIntroductionPageAdmin = async (req, res) => {
  try {
    const page = await NeiUsaIntroductionPage.findOne({ is_active: true })
      .select('-__v')
      .lean();
    
    // Return default demo data if page doesn't exist
    if (!page) {
      const defaultPageData = {
        heroSection: {
          title: "New Educational Initiative Corp",
          subtitle: "Making Quality Education Accessible to All",
          description: "A non-profit organization committed to making quality education accessible to all. We believe every young mind deserves the opportunity to learn and grow, regardless of background, geography, or circumstance."
        },
        aboutSection: {
          heading: "About NEIUSA",
          description: "New Educational Initiative Corp is a non-profit organization committed to making quality education accessible to all. We believe every young mind deserves the opportunity to learn and grow, regardless of background, geography, or circumstance. Our mission is to bring inclusive and transformative learning to underserved communities — including underprivileged youth, immigrants, Native American youth, and those affected by socio-economic or systemic barriers.",
          image: "/assets/images/NEIStudentImage.png"
        },
        visionSection: {
          heading: "Our Vision",
          description: "To create a future where education is a right, not a privilege — empowering students to reach their full potential and contribute meaningfully to society.",
          icon: "👁️"
        },
        missionSection: {
          heading: "Our Mission",
          missionItems: [
            "Provide accessible and low cost education to underserved learners",
            "Develop innovative and relevant learning programs",
            "Promote equity, diversity, and inclusion in education",
            "Foster leadership, critical thinking, and empowerment among youth"
          ],
          icon: "🎯"
        },
        whoWeServeSection: {
          heading: "Who We Serve",
          description: "NEIUSA focuses on marginalized and underserved groups, including:",
          image: "/assets/images/Picture2.png",
          items: [
            {
              _id: "demo-1",
              title: "Immigrant Youth",
              description: "Supporting immigrant youth in overcoming language barriers and integrating into American society.",
              display_order: 1
            },
            {
              _id: "demo-2",
              title: "Native American Youth",
              description: "Dedicated to uplifting through education, mentorship, and cultural preservation.",
              display_order: 2
            },
            {
              _id: "demo-3",
              title: "Youth in or coming out of incarceration",
              description: "Empowering through tailored educational programs and personalized support.",
              display_order: 3
            },
            {
              _id: "demo-4",
              title: "Youth from disadvantaged urban and rural communities",
              description: "Providing accessible education to underserved communities regardless of location.",
              display_order: 4
            }
          ]
        },
        whatWeOfferSection: {
          heading: "What We Offer",
          image: "/assets/images/Picture3.png",
          items: [
            {
              _id: "demo-5",
              title: "Blended Learning Models",
              description: "Combining online and offline teaching for flexible and effective learning.",
              display_order: 1
            },
            {
              _id: "demo-6",
              title: "Counseling and Mentorship",
              description: "Providing holistic growth support through dedicated guidance and mentorship.",
              display_order: 2
            },
            {
              _id: "demo-7",
              title: "Foundational Education and Skill-based Training",
              description: "Building strong educational foundations with practical skill development.",
              display_order: 3
            },
            {
              _id: "demo-8",
              title: "Volunteer and Community Engagement Opportunities",
              description: "Creating meaningful connections and community involvement programs.",
              display_order: 4
            }
          ]
        },
        joinUsSection: {
          heading: "Join Us",
          description: "Whether as a learner, volunteer, donor, or partner — your support strengthens our mission of building equitable access to education for all.",
          buttonText: "Get Involved",
          buttonLink: "https://neiusa.org/"
        }
      };

      return res.status(200).json({
        success: true,
        pageData: defaultPageData
      });
    }
    
    // Sort arrays by display_order
    if (page.whoWeServeSection?.items) {
      page.whoWeServeSection.items.sort((a, b) => {
        const orderA = a.display_order || 0;
        const orderB = b.display_order || 0;
        if (orderA === orderB) {
          return a._id.toString().localeCompare(b._id.toString());
        }
        return orderA - orderB;
      });
    }
    
    if (page.whatWeOfferSection?.items) {
      page.whatWeOfferSection.items.sort((a, b) => {
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
      pageData: page
    });
  } catch (error) {
    console.error('Error fetching NEI USA Introduction page:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch NEI USA Introduction page data',
      error: error.message
    });
  }
};

export const createNeiUsaIntroductionPage = async (req, res) => {
  try {
    const {
      heroSection,
      aboutSection,
      visionSection,
      missionSection,
      whoWeServeSection,
      whatWeOfferSection,
      joinUsSection
    } = req.body;

    // Check if page already exists
    const existingPage = await NeiUsaIntroductionPage.findOne({ is_active: true });
    if (existingPage) {
      return res.status(400).json({
        success: false,
        message: 'NEI USA Introduction page already exists. Use update instead.'
      });
    }

    const newPage = await NeiUsaIntroductionPage.create({
      heroSection,
      aboutSection,
      visionSection,
      missionSection,
      whoWeServeSection,
      whatWeOfferSection,
      joinUsSection
    });

    res.status(201).json({
      success: true,
      message: 'NEI USA Introduction page created successfully',
      data: newPage
    });
  } catch (error) {
    console.error('Error creating NEI USA Introduction page:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to create NEI USA Introduction page',
      error: error.message
    });
  }
};

export const updateNeiUsaIntroductionPage = async (req, res) => {
  try {
    const {
      heroSection,
      aboutSection,
      visionSection,
      missionSection,
      whoWeServeSection,
      whatWeOfferSection,
      joinUsSection
    } = req.body;

    let page = await NeiUsaIntroductionPage.findOne({ is_active: true });

    if (!page) {
      // Create new if doesn't exist
      page = await NeiUsaIntroductionPage.create({
        heroSection,
        aboutSection,
        visionSection,
        missionSection,
        whoWeServeSection,
        whatWeOfferSection,
        joinUsSection
      });
    } else {
      // Update existing
      if (heroSection) page.heroSection = heroSection;
      if (aboutSection) page.aboutSection = aboutSection;
      if (visionSection) page.visionSection = visionSection;
      if (missionSection) page.missionSection = missionSection;
      if (whoWeServeSection) page.whoWeServeSection = whoWeServeSection;
      if (whatWeOfferSection) page.whatWeOfferSection = whatWeOfferSection;
      if (joinUsSection) page.joinUsSection = joinUsSection;
      await page.save();
    }

    res.status(200).json({
      success: true,
      message: 'NEI USA Introduction page updated successfully',
      data: page
    });
  } catch (error) {
    console.error('Error updating NEI USA Introduction page:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update NEI USA Introduction page',
      error: error.message
    });
  }
};

export const reorderNeiUsaIntroductionItems = async (req, res) => {
  try {
    const { section, items } = req.body;

    const validSections = ['whoWeServe', 'whatWeOffer'];
    
    if (!validSections.includes(section)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid section. Must be one of: whoWeServe, whatWeOffer'
      });
    }

    if (!items || !Array.isArray(items)) {
      return res.status(400).json({
        success: false,
        message: 'Items array is required'
      });
    }

    const page = await NeiUsaIntroductionPage.findOne({ is_active: true });
    
    if (!page) {
      return res.status(404).json({
        success: false,
        message: 'NEI USA Introduction page not found'
      });
    }

    // Update display_order for each item
    for (const item of items) {
      const updateField = 
        section === 'whoWeServe' ? 'whoWeServeSection.items' :
        'whatWeOfferSection.items';

      await NeiUsaIntroductionPage.updateOne(
        { 
          _id: page._id,
          [`${updateField}._id`]: item.id
        },
        {
          $set: {
            [`${updateField}.$.display_order`]: item.display_order
          }
        }
      );
    }

    const updatedPage = await NeiUsaIntroductionPage.findById(page._id);

    res.status(200).json({
      success: true,
      message: `${section} order updated successfully`,
      data: updatedPage
    });
  } catch (error) {
    console.error('Error reordering items:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to reorder items',
      error: error.message
    });
  }
};

export const uploadNeiUsaIntroductionAboutImage = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: 'Image file is required'
      });
    }

    const imageUrl = req.file.location;

    const page = await NeiUsaIntroductionPage.findOne({ is_active: true });

    if (!page) {
      await deleteSingleImageFromS3(req.file.key);
      return res.status(404).json({
        success: false,
        message: 'NEI USA Introduction page not found. Create page first.'
      });
    }

    // Delete old image if exists
    if (page.aboutSection?.image) {
      const oldImageKey = createS3KeyFromImageUrl(page.aboutSection.image);
      await deleteSingleImageFromS3(oldImageKey);
    }

    // Update page with new image
    if (!page.aboutSection) {
      page.aboutSection = {};
    }
    page.aboutSection.image = imageUrl;
    await page.save();

    res.status(200).json({
      success: true,
      message: 'About image uploaded successfully',
      data: {
        image: imageUrl
      }
    });
  } catch (error) {
    if (req.file) {
      await deleteSingleImageFromS3(req.file.key);
    }
    console.error('Error uploading about image:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to upload about image',
      error: error.message
    });
  }
};

export const uploadNeiUsaIntroductionWhoWeServeImage = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: 'Image file is required'
      });
    }

    const imageUrl = req.file.location;

    const page = await NeiUsaIntroductionPage.findOne({ is_active: true });

    if (!page) {
      await deleteSingleImageFromS3(req.file.key);
      return res.status(404).json({
        success: false,
        message: 'NEI USA Introduction page not found. Create page first.'
      });
    }

    // Delete old image if exists
    if (page.whoWeServeSection?.image) {
      const oldImageKey = createS3KeyFromImageUrl(page.whoWeServeSection.image);
      await deleteSingleImageFromS3(oldImageKey);
    }

    // Update page with new image
    if (!page.whoWeServeSection) {
      page.whoWeServeSection = {};
    }
    page.whoWeServeSection.image = imageUrl;
    await page.save();

    res.status(200).json({
      success: true,
      message: 'Who We Serve image uploaded successfully',
      data: {
        image: imageUrl
      }
    });
  } catch (error) {
    if (req.file) {
      await deleteSingleImageFromS3(req.file.key);
    }
    console.error('Error uploading who we serve image:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to upload who we serve image',
      error: error.message
    });
  }
};

export const uploadNeiUsaIntroductionWhatWeOfferImage = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: 'Image file is required'
      });
    }

    const imageUrl = req.file.location;

    const page = await NeiUsaIntroductionPage.findOne({ is_active: true });

    if (!page) {
      await deleteSingleImageFromS3(req.file.key);
      return res.status(404).json({
        success: false,
        message: 'NEI USA Introduction page not found. Create page first.'
      });
    }

    // Delete old image if exists
    if (page.whatWeOfferSection?.image) {
      const oldImageKey = createS3KeyFromImageUrl(page.whatWeOfferSection.image);
      await deleteSingleImageFromS3(oldImageKey);
    }

    // Update page with new image
    if (!page.whatWeOfferSection) {
      page.whatWeOfferSection = {};
    }
    page.whatWeOfferSection.image = imageUrl;
    await page.save();

    res.status(200).json({
      success: true,
      message: 'What We Offer image uploaded successfully',
      data: {
        image: imageUrl
      }
    });
  } catch (error) {
    if (req.file) {
      await deleteSingleImageFromS3(req.file.key);
    }
    console.error('Error uploading what we offer image:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to upload what we offer image',
      error: error.message
    });
  }
};

export const deleteNeiUsaIntroductionPage = async (req, res) => {
  try {
    const page = await NeiUsaIntroductionPage.findOne({ is_active: true });
    
    if (!page) {
      return res.status(404).json({
        success: false,
        message: 'NEI USA Introduction page not found'
      });
    }

    // Delete images from S3 if exists
    if (page.aboutSection?.image) {
      const imageKey = createS3KeyFromImageUrl(page.aboutSection.image);
      await deleteSingleImageFromS3(imageKey);
    }
    if (page.whoWeServeSection?.image) {
      const imageKey = createS3KeyFromImageUrl(page.whoWeServeSection.image);
      await deleteSingleImageFromS3(imageKey);
    }
    if (page.whatWeOfferSection?.image) {
      const imageKey = createS3KeyFromImageUrl(page.whatWeOfferSection.image);
      await deleteSingleImageFromS3(imageKey);
    }

    await NeiUsaIntroductionPage.findByIdAndDelete(page._id);

    res.status(200).json({
      success: true,
      message: 'NEI USA Introduction page deleted successfully'
    });
  } catch (error) {
    console.error('Error deleting NEI USA Introduction page:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to delete NEI USA Introduction page',
      error: error.message
    });
  }
};

// ============================================
// GLOBAL PARTNERS ADMIN FUNCTIONS
// ============================================

// @desc    Get all global partners (Admin)
// @route   GET /api/admin/global-partners
// @access  Private/Admin
export const getAllGlobalPartners = async (req, res) => {
  try {
    const partners = await GlobalPartner.find()
      .sort({ display_order: 1, createdAt: -1 });
    
    res.status(200).json({
      success: true,
      data: partners
    });
  } catch (error) {
    console.error('Error fetching global partners:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch global partners'
    });
  }
};

// @desc    Get single global partner by ID (Admin)
// @route   GET /api/admin/global-partners/:id
// @access  Private/Admin
export const getGlobalPartnerById = async (req, res) => {
  try {
    const partner = await GlobalPartner.findById(req.params.id);
    
    if (!partner) {
      return res.status(404).json({
        success: false,
        message: 'Global partner not found'
      });
    }
    
    res.status(200).json({
      success: true,
      data: partner
    });
  } catch (error) {
    console.error('Error fetching global partner:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch global partner'
    });
  }
};

// @desc    Create new global partner
// @route   POST /api/admin/global-partners
// @access  Private/Admin
export const createGlobalPartner = async (req, res) => {
  try {
    const {
      name,
      shortName,
      location,
      website,
      shortDescription,
      about,
      collaboration,
      impact,
      programs
    } = req.body;

    // Validate required fields
    if (!name || !shortName || !location || !shortDescription) {
      return res.status(400).json({
        success: false,
        message: 'Please provide all required fields'
      });
    }

    // Check for images
    if (!req.files || !req.files.featuredImage || !req.files.detailImages) {
      return res.status(400).json({
        success: false,
        message: 'Featured image and detail images are required'
      });
    }

    const featuredImage = req.files.featuredImage[0];
    const detailImages = req.files.detailImages;

    // Parse programs if provided as JSON string
    let parsedPrograms = [];
    if (programs) {
      try {
        parsedPrograms = JSON.parse(programs);
        if (!Array.isArray(parsedPrograms)) {
          parsedPrograms = [programs];
        }
      } catch (e) {
        parsedPrograms = [programs];
      }
    }

    // Get the highest display_order
    const lastPartner = await GlobalPartner.findOne()
      .sort({ display_order: -1 });
    const display_order = lastPartner ? lastPartner.display_order + 1 : 1;

    // Create partner
    const partner = await GlobalPartner.create({
      name,
      shortName,
      location,
      website,
      featuredImage: featuredImage.location,
      featuredImageKey: featuredImage.key,
      detailImages: detailImages.map(img => img.location),
      detailImageKeys: detailImages.map(img => img.key),
      shortDescription,
      about,
      collaboration,
      impact,
      programs: parsedPrograms,
      display_order
    });

    res.status(201).json({
      success: true,
      data: partner,
      message: 'Global partner created successfully'
    });
  } catch (error) {
    console.error('Error creating global partner:', error);
    
    // Cleanup uploaded images on error
    if (req.files) {
      if (req.files.featuredImage) {
        await deleteSingleImageFromS3(req.files.featuredImage[0].key);
      }
      if (req.files.detailImages) {
        for (const img of req.files.detailImages) {
          await deleteSingleImageFromS3(img.key);
        }
      }
    }
    
    res.status(500).json({
      success: false,
      message: error.message || 'Failed to create global partner'
    });
  }
};

// @desc    Update global partner
// @route   PUT /api/admin/global-partners/:id
// @access  Private/Admin
export const updateGlobalPartner = async (req, res) => {
  try {
    const partner = await GlobalPartner.findById(req.params.id);
    
    if (!partner) {
      // Cleanup uploaded images if any
      if (req.files) {
        if (req.files.featuredImage) {
          await deleteSingleImageFromS3(req.files.featuredImage[0].key);
        }
        if (req.files.detailImages) {
          for (const img of req.files.detailImages) {
            await deleteSingleImageFromS3(img.key);
          }
        }
      }
      
      return res.status(404).json({
        success: false,
        message: 'Global partner not found'
      });
    }

    // ========================================
    // HANDLE DETAIL IMAGES UPDATE
    // ========================================
    
    let finalDetailImages = [];
    let finalDetailImageKeys = [];
    
    // Step 1: Parse existing images from request (images to keep)
    let existingImagesToKeep = [];
    let existingKeysToKeep = [];
    
    if (req.body.existingDetailImages) {
      try {
        const parsedExisting = JSON.parse(req.body.existingDetailImages);
        existingImagesToKeep = Array.isArray(parsedExisting) ? parsedExisting : [];
        
        // Get corresponding keys for images we're keeping
        existingKeysToKeep = existingImagesToKeep.map(url => {
          const index = partner.detailImages.indexOf(url);
          return index !== -1 ? partner.detailImageKeys[index] : null;
        }).filter(key => key !== null);
        
      } catch (e) {
        console.error('Error parsing existingDetailImages:', e);
      }
    }
    
    // Step 2: Parse images to remove
    let imagesToRemove = [];
    if (req.body.imagesToRemove) {
      try {
        const parsedRemove = JSON.parse(req.body.imagesToRemove);
        imagesToRemove = Array.isArray(parsedRemove) ? parsedRemove : [];
      } catch (e) {
        console.error('Error parsing imagesToRemove:', e);
      }
    }
    
    // Step 3: Delete images from S3 that are marked for removal
    if (imagesToRemove.length > 0) {
      for (const imageInfo of imagesToRemove) {
        if (imageInfo.key) {
          await deleteSingleImageFromS3(imageInfo.key);
          console.log('Deleted image from S3:', imageInfo.key);
        }
      }
    }
    
    // Step 4: Add existing images that we're keeping
    finalDetailImages = [...existingImagesToKeep];
    finalDetailImageKeys = [...existingKeysToKeep];
    
    // Step 5: Add new uploaded images
    if (req.files && req.files.detailImages && req.files.detailImages.length > 0) {
      const newDetailImages = req.files.detailImages;
      const newImageUrls = newDetailImages.map(img => img.location);
      const newImageKeys = newDetailImages.map(img => img.key);
      
      finalDetailImages = [...finalDetailImages, ...newImageUrls];
      finalDetailImageKeys = [...finalDetailImageKeys, ...newImageKeys];
      
      console.log('Added new images:', newImageUrls.length);
    }
    
    // Step 6: Validate that at least one detail image exists
    if (finalDetailImages.length === 0) {
      // Cleanup new uploads if validation fails
      if (req.files && req.files.detailImages) {
        for (const img of req.files.detailImages) {
          await deleteSingleImageFromS3(img.key);
        }
      }
      
      return res.status(400).json({
        success: false,
        message: 'At least one detail image is required'
      });
    }
    
    // Step 7: Update partner with final image arrays
    partner.detailImages = finalDetailImages;
    partner.detailImageKeys = finalDetailImageKeys;

    // ========================================
    // HANDLE FEATURED IMAGE UPDATE (if provided)
    // ========================================
    
    if (req.files && req.files.featuredImage) {
      const oldFeaturedImageKey = partner.featuredImageKey;
      const newFeaturedImage = req.files.featuredImage[0];
      
      partner.featuredImage = newFeaturedImage.location;
      partner.featuredImageKey = newFeaturedImage.key;
      
      // Delete old featured image
      if (oldFeaturedImageKey) {
        await deleteSingleImageFromS3(oldFeaturedImageKey);
      }
    }

    // ========================================
    // UPDATE TEXT FIELDS
    // ========================================
    
    const updateFields = [
      'name', 'shortName', 'location', 'website',
      'shortDescription', 'about', 'collaboration', 'impact'
    ];

    updateFields.forEach(field => {
      if (req.body[field] !== undefined) {
        partner[field] = req.body[field];
      }
    });

    // Handle programs separately (parse JSON)
    if (req.body.programs !== undefined) {
      try {
        let parsedPrograms = JSON.parse(req.body.programs);
        if (!Array.isArray(parsedPrograms)) {
          parsedPrograms = [req.body.programs];
        }
        partner.programs = parsedPrograms;
      } catch (e) {
        partner.programs = [req.body.programs];
      }
    }

    // Save changes
    await partner.save();

    res.status(200).json({
      success: true,
      data: partner,
      message: 'Global partner updated successfully'
    });
    
  } catch (error) {
    console.error('Error updating global partner:', error);
    
    // Cleanup new uploaded images on error
    if (req.files) {
      if (req.files.featuredImage) {
        await deleteSingleImageFromS3(req.files.featuredImage[0].key);
      }
      if (req.files.detailImages) {
        for (const img of req.files.detailImages) {
          await deleteSingleImageFromS3(img.key);
        }
      }
    }
    
    res.status(500).json({
      success: false,
      message: error.message || 'Failed to update global partner'
    });
  }
};

// @desc    Delete global partner
// @route   DELETE /api/admin/global-partners/:id
// @access  Private/Admin
export const deleteGlobalPartner = async (req, res) => {
  try {
    const partner = await GlobalPartner.findById(req.params.id);
    
    if (!partner) {
      return res.status(404).json({
        success: false,
        message: 'Global partner not found'
      });
    }

    // Delete featured image from S3
    if (partner.featuredImageKey) {
      await deleteSingleImageFromS3(partner.featuredImageKey);
    }

    // Delete detail images from S3
    if (partner.detailImageKeys && partner.detailImageKeys.length > 0) {
      for (const key of partner.detailImageKeys) {
        await deleteSingleImageFromS3(key);
      }
    }

    await partner.deleteOne();

    res.status(200).json({
      success: true,
      message: 'Global partner deleted successfully'
    });
  } catch (error) {
    console.error('Error deleting global partner:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to delete global partner'
    });
  }
};

// @desc    Reorder global partners
// @route   PUT /api/admin/global-partners/reorder
// @access  Private/Admin
export const reorderGlobalPartners = async (req, res) => {
  try {
    const { items } = req.body;
    
    if (!items || !Array.isArray(items)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid reorder data'
      });
    }

    // Update display_order for each partner
    const updatePromises = items.map(item => 
      GlobalPartner.findByIdAndUpdate(
        item.id,
        { display_order: item.display_order },
        { new: true }
      )
    );

    await Promise.all(updatePromises);

    res.status(200).json({
      success: true,
      message: 'Global partners reordered successfully'
    });
  } catch (error) {
    console.error('Error reordering global partners:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to reorder global partners'
    });
  }
};

// ============================================
// SOFT SKILL TRAINING PAGE ADMIN FUNCTIONS
// ============================================
import SoftSkillTrainingPage from '../models/SoftSkillTrainingPage.js';

export const getSoftSkillTrainingPageAdmin = async (req, res) => {
  try {
    const page = await SoftSkillTrainingPage.findOne({ is_active: true }).select('-__v').lean();
    if (!page) {
      return res.status(404).json({ success: false, message: 'Soft Skill Training page data not found' });
    }
    if (page.keyBenefitsSection?.benefits) {
      page.keyBenefitsSection.benefits.sort((a,b)=> (a.display_order||0)-(b.display_order||0));
    }
    if (page.programHighlightsSection?.highlights) {
      page.programHighlightsSection.highlights.sort((a,b)=> (a.display_order||0)-(b.display_order||0));
    }
    res.status(200).json({ success: true, data: page });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to fetch soft skill training page', error: error.message });
  }
};

export const createSoftSkillTrainingPage = async (req, res) => {
  try {
    const existing = await SoftSkillTrainingPage.findOne({ is_active: true });
    if (existing) {
      return res.status(400).json({ success: false, message: 'Soft Skill Training page already exists. Use update instead.' });
    }
    const page = await SoftSkillTrainingPage.create(req.body);
    res.status(201).json({ success: true, message: 'Soft Skill Training page created successfully', data: page });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to create soft skill training page', error: error.message });
  }
};

export const updateSoftSkillTrainingPage = async (req, res) => {
  try {
    let page = await SoftSkillTrainingPage.findOne({ is_active: true });
    if (!page) {
      page = await SoftSkillTrainingPage.create(req.body);
    } else {
      const { heroSection, introduction, keyBenefitsSection, programHighlightsSection } = req.body;
      if (heroSection) page.heroSection = heroSection;
      if (introduction) page.introduction = introduction;
      if (keyBenefitsSection) page.keyBenefitsSection = keyBenefitsSection;
      if (programHighlightsSection) page.programHighlightsSection = programHighlightsSection;
      await page.save();
    }
    res.status(200).json({ success: true, message: 'Soft Skill Training page updated successfully', data: page });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to update soft skill training page', error: error.message });
  }
};

export const reorderSoftSkillTrainingItems = async (req, res) => {
  try {
    const { section, items } = req.body;
    const validSections = ['benefits', 'highlights'];
    if (!validSections.includes(section)) {
      return res.status(400).json({ success: false, message: 'Invalid section. Must be one of: benefits, highlights' });
    }
    if (!items || !Array.isArray(items)) {
      return res.status(400).json({ success: false, message: 'Items array is required' });
    }
    const page = await SoftSkillTrainingPage.findOne({ is_active: true });
    if (!page) {
      return res.status(404).json({ success: false, message: 'Soft Skill Training page not found' });
    }
    const updateField = section === 'benefits' ? 'keyBenefitsSection.benefits' : 'programHighlightsSection.highlights';
    for (const item of items) {
      await SoftSkillTrainingPage.updateOne(
        { _id: page._id, [`${updateField}._id`]: item.id },
        { $set: { [`${updateField}.$.display_order`]: item.display_order } }
      );
    }
    const updated = await SoftSkillTrainingPage.findById(page._id);
    res.status(200).json({ success: true, message: `Soft Skill Training ${section} reordered successfully`, data: updated });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to reorder items', error: error.message });
  }
};

export const uploadSoftSkillTrainingHeroImage = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ success: false, message: 'Image file is required' });
    }
    const imageUrl = req.file.location;
    const page = await SoftSkillTrainingPage.findOne({ is_active: true });
    if (!page) {
      await deleteSingleImageFromS3(req.file.key);
      return res.status(404).json({ success: false, message: 'Soft Skill Training page not found. Create page first.' });
    }
    if (page.heroSection?.heroImage) {
      const oldKey = createS3KeyFromImageUrl(page.heroSection.heroImage);
      await deleteSingleImageFromS3(oldKey);
    }
    if (!page.heroSection) page.heroSection = {};
    page.heroSection.heroImage = imageUrl;
    await page.save();
    res.status(200).json({ success: true, message: 'Hero image uploaded successfully', data: { image: imageUrl } });
  } catch (error) {
    if (req.file) await deleteSingleImageFromS3(req.file.key);
    res.status(500).json({ success: false, message: 'Failed to upload hero image', error: error.message });
  }
};

export const deleteSoftSkillTrainingPage = async (req, res) => {
  try {
    const page = await SoftSkillTrainingPage.findOne({ is_active: true });
    if (!page) {
      return res.status(404).json({ success: false, message: 'Soft Skill Training page not found' });
    }
    if (page.heroSection?.heroImage) {
      const key = createS3KeyFromImageUrl(page.heroSection.heroImage);
      await deleteSingleImageFromS3(key);
    }
    await SoftSkillTrainingPage.findByIdAndDelete(page._id);
    res.status(200).json({ success: true, message: 'Soft Skill Training page deleted successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to delete soft skill training page', error: error.message });
  }
};

// ============================================
// TECHNICAL SKILL TRAINING PAGE ADMIN FUNCTIONS
// ============================================
import TechnicalSkillTrainingPage from "../models/TechnicalSkillTrainingPage.js";

export const getTechnicalSkillTrainingPageAdmin = async (req, res) => {
  try {
    const page = await TechnicalSkillTrainingPage.findOne({ is_active: true })
      .select("-__v")
      .lean();
    if (!page) {
      return res
        .status(404)
        .json({ success: false, message: "Technical Skill Training page data not found" });
    }
    const sortByOrder = (arr) =>
      Array.isArray(arr)
        ? arr.sort((a, b) => {
            const aO = a.display_order || 0;
            const bO = b.display_order || 0;
            if (aO === bO) return a._id.toString().localeCompare(b._id.toString());
            return aO - bO;
          })
        : arr;
    if (page.targetGroupsSection?.groups) page.targetGroupsSection.groups = sortByOrder(page.targetGroupsSection.groups);
    if (page.learningModesSection?.modes) page.learningModesSection.modes = sortByOrder(page.learningModesSection.modes);
    if (page.impactAreasSection?.areas) page.impactAreasSection.areas = sortByOrder(page.impactAreasSection.areas);
    if (page.testimonialsSection?.testimonials) page.testimonialsSection.testimonials = sortByOrder(page.testimonialsSection.testimonials);
    return res.status(200).json({ success: true, data: page });
  } catch (error) {
    return res.status(500).json({ success: false, message: "Failed to fetch technical skill training page", error: error.message });
  }
};

// reuse global cleanArrayItems defined earlier in this file

export const createTechnicalSkillTrainingPage = async (req, res) => {
  try {
    const data = req.body;
    const existing = await TechnicalSkillTrainingPage.findOne({ is_active: true });
    if (existing) {
      return res.status(400).json({ success: false, message: "Technical Skill Training page already exists. Use update instead." });
    }
    const payload = { ...data };
    if (payload.targetGroupsSection?.groups)
      payload.targetGroupsSection.groups = cleanArrayItems(payload.targetGroupsSection.groups);
    if (payload.learningModesSection?.modes)
      payload.learningModesSection.modes = cleanArrayItems(payload.learningModesSection.modes);
    if (payload.impactAreasSection?.areas)
      payload.impactAreasSection.areas = cleanArrayItems(payload.impactAreasSection.areas);
    if (payload.testimonialsSection?.testimonials)
      payload.testimonialsSection.testimonials = cleanArrayItems(payload.testimonialsSection.testimonials);
    const created = await TechnicalSkillTrainingPage.create(payload);
    return res.status(201).json({ success: true, message: "Technical Skill Training page created", data: created });
  } catch (error) {
    return res.status(500).json({ success: false, message: "Failed to create technical skill training page", error: error.message });
  }
};

export const updateTechnicalSkillTrainingPage = async (req, res) => {
  try {
    const data = req.body;
    let page = await TechnicalSkillTrainingPage.findOne({ is_active: true });
    if (!page) {
      const payload = { ...data };
      if (payload.targetGroupsSection?.groups)
        payload.targetGroupsSection.groups = cleanArrayItems(payload.targetGroupsSection.groups);
      if (payload.learningModesSection?.modes)
        payload.learningModesSection.modes = cleanArrayItems(payload.learningModesSection.modes);
      if (payload.impactAreasSection?.areas)
        payload.impactAreasSection.areas = cleanArrayItems(payload.impactAreasSection.areas);
      if (payload.testimonialsSection?.testimonials)
        payload.testimonialsSection.testimonials = cleanArrayItems(payload.testimonialsSection.testimonials);
      page = await TechnicalSkillTrainingPage.create(payload);
    } else {
      if (data.heroSection) page.heroSection = data.heroSection;
      if (data.introduction) page.introduction = data.introduction;
      if (data.toolsSection) page.toolsSection = data.toolsSection;
      if (data.solutionSection) page.solutionSection = data.solutionSection;
      if (data.targetGroupsSection) {
        const g = data.targetGroupsSection;
        if (g.heading !== undefined) page.targetGroupsSection.heading = g.heading;
        if (g.groups) page.targetGroupsSection.groups = cleanArrayItems(g.groups);
      }
      if (data.learningModesSection) {
        const m = data.learningModesSection;
        if (m.heading !== undefined) page.learningModesSection.heading = m.heading;
        if (m.description !== undefined) page.learningModesSection.description = m.description;
        if (m.modes) page.learningModesSection.modes = cleanArrayItems(m.modes);
      }
      if (data.impactAreasSection) {
        const a = data.impactAreasSection;
        if (a.heading !== undefined) page.impactAreasSection.heading = a.heading;
        if (a.description !== undefined) page.impactAreasSection.description = a.description;
        if (a.areas) page.impactAreasSection.areas = cleanArrayItems(a.areas);
      }
      if (data.testimonialsSection) {
        const t = data.testimonialsSection;
        if (t.heading !== undefined) page.testimonialsSection.heading = t.heading;
        if (t.description !== undefined) page.testimonialsSection.description = t.description;
        if (t.testimonials) page.testimonialsSection.testimonials = cleanArrayItems(t.testimonials);
      }
      await page.save();
    }
    return res.status(200).json({ success: true, message: "Technical Skill Training page updated", data: page });
  } catch (error) {
    return res.status(500).json({ success: false, message: "Failed to update technical skill training page", error: error.message });
  }
};

export const reorderTechnicalSkillTrainingItems = async (req, res) => {
  try {
    const { section, items } = req.body;
    const valid = ["targetGroups", "learningModes", "impactAreas", "testimonials"];
    if (!valid.includes(section)) {
      return res.status(400).json({ success: false, message: "Invalid section" });
    }
    if (!Array.isArray(items)) {
      return res.status(400).json({ success: false, message: "Items array is required" });
    }
    const page = await TechnicalSkillTrainingPage.findOne({ is_active: true });
    if (!page) return res.status(404).json({ success: false, message: "Page not found" });
    let field = null;
    if (section === "targetGroups") field = "targetGroupsSection.groups";
    if (section === "learningModes") field = "learningModesSection.modes";
    if (section === "impactAreas") field = "impactAreasSection.areas";
    if (section === "testimonials") field = "testimonialsSection.testimonials";
    for (const item of items) {
      await TechnicalSkillTrainingPage.updateOne(
        { _id: page._id, [`${field}._id`]: item.id },
        { $set: { [`${field}.$.display_order`]: item.display_order } }
      );
    }
    const updated = await TechnicalSkillTrainingPage.findById(page._id);
    return res.status(200).json({ success: true, message: "Order updated", data: updated });
  } catch (error) {
    return res.status(500).json({ success: false, message: "Failed to reorder items", error: error.message });
  }
};

export const uploadTechnicalSkillTrainingHeroImage = async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ success: false, message: "Image file is required" });
    const page = await TechnicalSkillTrainingPage.findOne({ is_active: true });
    if (!page) {
      await deleteSingleImageFromS3(req.file.key);
      return res.status(404).json({ success: false, message: "Page not found. Create page first." });
    }
    
    // Store old image URL before updating
    const oldImageUrl = page.heroSection?.heroImage;
    
    try {
      // Update hero image URL
      if (!page.heroSection) {
        page.heroSection = {};
      }
      page.heroSection.heroImage = req.file.location;
      // Mark the nested path as modified for Mongoose
      page.markModified('heroSection');
      await page.save();
      
      // Delete old image from S3 after successful database update
      if (oldImageUrl) {
        const oldKey = createS3KeyFromImageUrl(oldImageUrl);
        if (oldKey) await deleteSingleImageFromS3(oldKey);
      }
      
      // Return the updated page data (use .lean() to get plain object)
      const updatedPage = await TechnicalSkillTrainingPage.findOne({ is_active: true })
        .select('-__v')
        .lean();
      return res.status(200).json({ 
        success: true, 
        message: "Hero image uploaded successfully", 
        data: updatedPage 
      });
    } catch (dbError) {
      // If database update fails, clean up the newly uploaded file
      console.error('Database update failed, cleaning up uploaded file:', dbError);
      await deleteSingleImageFromS3(req.file.key);
      throw dbError;
    }
  } catch (error) {
    console.error('Error uploading hero image (Technical Skill Training):', error);
    // Ensure cleanup if file was uploaded but error occurred
    if (req.file && req.file.key) {
      try {
        await deleteSingleImageFromS3(req.file.key);
      } catch (cleanupError) {
        console.error('Error cleaning up uploaded file:', cleanupError);
      }
    }
    return res.status(500).json({ success: false, message: "Failed to upload hero image", error: error.message });
  }
};

export const uploadTechnicalSkillTrainingModeImage = async (req, res) => {
  try {
    const { itemId } = req.params;
    if (!req.file) return res.status(400).json({ success: false, message: "Image file is required" });
    const page = await TechnicalSkillTrainingPage.findOne({ is_active: true });
    if (!page) {
      await deleteSingleImageFromS3(req.file.key);
      return res.status(404).json({ success: false, message: "Page not found. Create page first." });
    }
    const mode = page.learningModesSection?.modes?.find((m) => m._id.toString() === itemId);
    if (!mode) {
      await deleteSingleImageFromS3(req.file.key);
      return res.status(404).json({ success: false, message: "Learning mode not found" });
    }
    if (mode.image) {
      const oldKey = createS3KeyFromImageUrl(mode.image);
      if (oldKey) await deleteSingleImageFromS3(oldKey);
    }
    mode.image = req.file.location;
    await page.save();
    return res.status(200).json({ success: true, message: "Mode image uploaded", data: { image: req.file.location } });
  } catch (error) {
    if (req.file) await deleteSingleImageFromS3(req.file.key);
    return res.status(500).json({ success: false, message: "Failed to upload mode image", error: error.message });
  }
};

export const deleteTechnicalSkillTrainingPage = async (req, res) => {
  try {
    const page = await TechnicalSkillTrainingPage.findOne({ is_active: true });
    if (!page) return res.status(404).json({ success: false, message: "Page not found" });
    if (page.heroSection?.heroImage) {
      const key = createS3KeyFromImageUrl(page.heroSection.heroImage);
      if (key) await deleteSingleImageFromS3(key);
    }
    if (Array.isArray(page.learningModesSection?.modes)) {
      for (const m of page.learningModesSection.modes) {
        if (m.image) {
          const key = createS3KeyFromImageUrl(m.image);
          if (key) await deleteSingleImageFromS3(key);
        }
      }
    }
    await TechnicalSkillTrainingPage.findByIdAndDelete(page._id);
    return res.status(200).json({ success: true, message: "Technical Skill Training page deleted" });
  } catch (error) {
    return res.status(500).json({ success: false, message: "Failed to delete technical skill training page", error: error.message });
  }
};
// ============================================
// GIRLS EDUCATION PAGE ADMIN FUNCTIONS
// ============================================

export const getGirlsEducationPageAdmin = async (req, res) => {
  try {
    const page = await GirlsEducationPage.findOne({ is_active: true })
      .select('-__v')
      .lean();
    
    if (!page) {
      return res.status(404).json({
        success: false,
        message: 'Girls Education page data not found'
      });
    }
    
    // Sort arrays by display_order
    if (page.initiativesSection && page.initiativesSection.initiatives) {
      page.initiativesSection.initiatives.sort((a, b) => {
        const orderA = a.display_order || 0;
        const orderB = b.display_order || 0;
        if (orderA === orderB) {
          return a._id.toString().localeCompare(b._id.toString());
        }
        return orderA - orderB;
      });
    }
    
    if (page.impactSection && page.impactSection.partnerOrganizationsByState) {
      page.impactSection.partnerOrganizationsByState.sort((a, b) => {
        const orderA = a.display_order || 0;
        const orderB = b.display_order || 0;
        if (orderA === orderB) {
          return a._id.toString().localeCompare(b._id.toString());
        }
        return orderA - orderB;
      });
      
      // Sort partners within each state
      page.impactSection.partnerOrganizationsByState.forEach(state => {
        if (state.partners && Array.isArray(state.partners)) {
          state.partners.sort((a, b) => {
            const orderA = a.display_order || 0;
            const orderB = b.display_order || 0;
            if (orderA === orderB) {
              return a._id.toString().localeCompare(b._id.toString());
            }
            return orderA - orderB;
          });
        }
      });
    }
    
    if (page.lookingForwardSection && page.lookingForwardSection.futureVisionCards) {
      page.lookingForwardSection.futureVisionCards.sort((a, b) => {
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
    console.error('Error fetching girls education page:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch girls education page data',
      error: error.message
    });
  }
};

export const createGirlsEducationPage = async (req, res) => {
  try {
    const {
      heroSection,
      visionAndPhilosophySection,
      initiativesSection,
      impactSection,
      lookingForwardSection,
      scalableModelSection,
      joinMovementSection
    } = req.body;

    // Check if page already exists
    const existingPage = await GirlsEducationPage.findOne({ is_active: true });
    if (existingPage) {
      return res.status(400).json({
        success: false,
        message: 'Girls Education page already exists. Use update instead.'
      });
    }

    // Clean arrays to remove temporary IDs
    const cleanedData = {
      heroSection,
      visionAndPhilosophySection,
      initiativesSection: initiativesSection ? {
        ...initiativesSection,
        initiatives: cleanArrayItems(initiativesSection.initiatives || [])
      } : initiativesSection,
      impactSection: impactSection ? {
        ...impactSection,
        partnerOrganizationsByState: cleanArrayItems(impactSection.partnerOrganizationsByState || [])
      } : impactSection,
      lookingForwardSection: lookingForwardSection ? {
        ...lookingForwardSection,
        futureVisionCards: cleanArrayItems(lookingForwardSection.futureVisionCards || [])
      } : lookingForwardSection,
      scalableModelSection,
      joinMovementSection
    };

    // Clean partners within states
    if (cleanedData.impactSection?.partnerOrganizationsByState) {
      cleanedData.impactSection.partnerOrganizationsByState = cleanedData.impactSection.partnerOrganizationsByState.map(state => ({
        ...state,
        partners: cleanArrayItems(state.partners || [])
      }));
    }

    const newPage = await GirlsEducationPage.create(cleanedData);

    res.status(201).json({
      success: true,
      message: 'Girls Education page created successfully',
      data: newPage
    });
  } catch (error) {
    console.error('Error creating girls education page:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to create girls education page',
      error: error.message
    });
  }
};

export const updateGirlsEducationPage = async (req, res) => {
  try {
    const {
      heroSection,
      visionAndPhilosophySection,
      initiativesSection,
      impactSection,
      lookingForwardSection,
      scalableModelSection,
      joinMovementSection
    } = req.body;

    let page = await GirlsEducationPage.findOne({ is_active: true });

    if (!page) {
      // Create new if doesn't exist - clean arrays
      const cleanedData = {
        heroSection,
        visionAndPhilosophySection,
        initiativesSection: initiativesSection ? {
          ...initiativesSection,
          initiatives: cleanArrayItems(initiativesSection.initiatives || [])
        } : initiativesSection,
        impactSection: impactSection ? {
          ...impactSection,
          partnerOrganizationsByState: cleanArrayItems(impactSection.partnerOrganizationsByState || [])
        } : impactSection,
        lookingForwardSection: lookingForwardSection ? {
          ...lookingForwardSection,
          futureVisionCards: cleanArrayItems(lookingForwardSection.futureVisionCards || [])
        } : lookingForwardSection,
        scalableModelSection,
        joinMovementSection
      };

      // Clean partners within states
      if (cleanedData.impactSection?.partnerOrganizationsByState) {
        cleanedData.impactSection.partnerOrganizationsByState = cleanedData.impactSection.partnerOrganizationsByState.map(state => ({
          ...state,
          partners: cleanArrayItems(state.partners || [])
        }));
      }

      page = await GirlsEducationPage.create(cleanedData);
    } else {
      // Update existing - clean arrays
      if (heroSection) page.heroSection = heroSection;
      if (visionAndPhilosophySection) page.visionAndPhilosophySection = visionAndPhilosophySection;
      
      if (initiativesSection) {
        if (initiativesSection.label !== undefined) page.initiativesSection.label = initiativesSection.label;
        if (initiativesSection.heading !== undefined) page.initiativesSection.heading = initiativesSection.heading;
        if (initiativesSection.description !== undefined) page.initiativesSection.description = initiativesSection.description;
        if (initiativesSection.initiatives) {
          page.initiativesSection.initiatives = cleanArrayItems(initiativesSection.initiatives);
        }
      }

      if (impactSection) {
        if (impactSection.label !== undefined) page.impactSection.label = impactSection.label;
        if (impactSection.heading !== undefined) page.impactSection.heading = impactSection.heading;
        if (impactSection.totalImpact) page.impactSection.totalImpact = impactSection.totalImpact;
        if (impactSection.partnerOrganizationsByState) {
          const cleanedStates = impactSection.partnerOrganizationsByState.map(state => ({
            ...state,
            partners: cleanArrayItems(state.partners || [])
          }));
          page.impactSection.partnerOrganizationsByState = cleanedStates;
        }
      }

      if (lookingForwardSection) {
        if (lookingForwardSection.label !== undefined) page.lookingForwardSection.label = lookingForwardSection.label;
        if (lookingForwardSection.heading !== undefined) page.lookingForwardSection.heading = lookingForwardSection.heading;
        if (lookingForwardSection.futureVisionCards) {
          page.lookingForwardSection.futureVisionCards = cleanArrayItems(lookingForwardSection.futureVisionCards);
        }
      }

      if (scalableModelSection) page.scalableModelSection = scalableModelSection;
      if (joinMovementSection) page.joinMovementSection = joinMovementSection;
      
      await page.save();
    }

    res.status(200).json({
      success: true,
      message: 'Girls Education page updated successfully',
      data: page
    });
  } catch (error) {
    console.error('Error updating girls education page:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update girls education page',
      error: error.message
    });
  }
};

export const reorderGirlsEducationItems = async (req, res) => {
  try {
    const { section, items } = req.body;

    const validSections = ['initiatives', 'partnerStates', 'partnerOrganizations', 'futureVisionCards'];
    
    if (!validSections.includes(section)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid section. Must be one of: initiatives, partnerStates, partnerOrganizations, futureVisionCards'
      });
    }

    if (!items || !Array.isArray(items)) {
      return res.status(400).json({
        success: false,
        message: 'Items array is required'
      });
    }

    const page = await GirlsEducationPage.findOne({ is_active: true });
    
    if (!page) {
      return res.status(404).json({
        success: false,
        message: 'Girls Education page not found'
      });
    }

    // Update display_order for each item
    for (const item of items) {
      let updateField;
      
      if (section === 'initiatives') {
        updateField = 'initiativesSection.initiatives';
      } else if (section === 'partnerStates') {
        updateField = 'impactSection.partnerOrganizationsByState';
      } else if (section === 'partnerOrganizations') {
        // For partner organizations, we need stateId as well
        const { stateId } = item;
        if (!stateId) {
          continue; // Skip if stateId is missing
        }
        const stateIndex = page.impactSection.partnerOrganizationsByState.findIndex(
          s => s._id.toString() === stateId.toString()
        );
        if (stateIndex === -1) continue;
        
        await GirlsEducationPage.updateOne(
          { 
            _id: page._id,
            [`impactSection.partnerOrganizationsByState.${stateIndex}.partners._id`]: item.id
          },
          {
            $set: {
              [`impactSection.partnerOrganizationsByState.${stateIndex}.partners.$.display_order`]: item.display_order
            }
          }
        );
        continue; // Continue to next item since we already updated
      } else if (section === 'futureVisionCards') {
        updateField = 'lookingForwardSection.futureVisionCards';
      } else {
        continue;
      }

      // Update for initiatives, partnerStates, or futureVisionCards
      if (updateField) {
        await GirlsEducationPage.updateOne(
          { 
            _id: page._id,
            [`${updateField}._id`]: item.id
          },
          {
            $set: {
              [`${updateField}.$.display_order`]: item.display_order
            }
          }
        );
      }
    }

    const updatedPage = await GirlsEducationPage.findById(page._id);

    res.status(200).json({
      success: true,
      message: 'Items reordered successfully',
      data: updatedPage
    });
  } catch (error) {
    console.error('Error reordering items:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to reorder items',
      error: error.message
    });
  }
};

export const uploadGirlsEducationHeroImage = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: 'Image file is required'
      });
    }

    const imageUrl = req.file.location;

    const page = await GirlsEducationPage.findOne({ is_active: true });

    if (!page) {
      await deleteSingleImageFromS3(req.file.key);
      return res.status(404).json({
        success: false,
        message: 'Girls Education page not found. Create page first.'
      });
    }

    // Delete old image if exists
    if (page.heroSection?.heroImage) {
      const oldImageKey = createS3KeyFromImageUrl(page.heroSection.heroImage);
      await deleteSingleImageFromS3(oldImageKey);
    }

    // Update only the heroImage field
    await GirlsEducationPage.updateOne(
      { _id: page._id },
      { $set: { 'heroSection.heroImage': imageUrl } }
    );

    res.status(200).json({
      success: true,
      message: 'Hero image uploaded successfully',
      data: {
        image: imageUrl
      }
    });
  } catch (error) {
    if (req.file) {
      await deleteSingleImageFromS3(req.file.key);
    }
    console.error('Error uploading hero image:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to upload hero image',
      error: error.message
    });
  }
};

export const uploadGirlsEducationImpactImage = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: 'Image file is required'
      });
    }

    const imageUrl = req.file.location;

    const page = await GirlsEducationPage.findOne({ is_active: true });

    if (!page) {
      await deleteSingleImageFromS3(req.file.key);
      return res.status(404).json({
        success: false,
        message: 'Girls Education page not found. Create page first.'
      });
    }

    // Delete old image if exists
    if (page.impactSection?.totalImpact?.image) {
      const oldImageKey = createS3KeyFromImageUrl(page.impactSection.totalImpact.image);
      await deleteSingleImageFromS3(oldImageKey);
    }

    // Update only the impact image field
    await GirlsEducationPage.updateOne(
      { _id: page._id },
      { $set: { 'impactSection.totalImpact.image': imageUrl } }
    );

    res.status(200).json({
      success: true,
      message: 'Impact image uploaded successfully',
      data: {
        image: imageUrl
      }
    });
  } catch (error) {
    if (req.file) {
      await deleteSingleImageFromS3(req.file.key);
    }
    console.error('Error uploading impact image:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to upload impact image',
      error: error.message
    });
  }
};

export const deleteGirlsEducationPage = async (req, res) => {
  try {
    const page = await GirlsEducationPage.findOne({ is_active: true });
    
    if (!page) {
      return res.status(404).json({
        success: false,
        message: 'Girls Education page not found'
      });
    }

    // Delete images from S3 if exists
    if (page.heroSection?.heroImage) {
      const imageKey = createS3KeyFromImageUrl(page.heroSection.heroImage);
      await deleteSingleImageFromS3(imageKey);
    }
    if (page.impactSection?.totalImpact?.image) {
      const imageKey = createS3KeyFromImageUrl(page.impactSection.totalImpact.image);
      await deleteSingleImageFromS3(imageKey);
    }

    await GirlsEducationPage.findByIdAndDelete(page._id);

    res.status(200).json({
      success: true,
      message: 'Girls Education page deleted successfully'
    });
  } catch (error) {
    console.error('Error deleting girls education page:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to delete girls education page',
      error: error.message
    });
  }
};

// ============================================
// GLOBAL EDUCATION PAGE ADMIN FUNCTIONS
// ============================================

export const getGlobalEducationPageAdmin = async (req, res) => {
  try {
    const page = await GlobalEducationPage.findOne({ is_active: true }).select('-__v').lean();
    if (!page) return res.status(404).json({ success: false, message: 'Global Education page data not found' });
    if (page.sdgFocusSection?.contributions) page.sdgFocusSection.contributions.sort((a,b)=>(a.display_order||0)-(b.display_order||0));
    if (page.valuesList) page.valuesList.sort((a,b)=>(a.display_order||0)-(b.display_order||0));
    return res.status(200).json({ success: true, data: page });
  } catch (error) {
    return res.status(500).json({ success: false, message: 'Failed to get Global Education page', error: error.message });
  }
};

export const createGlobalEducationPage = async (req, res) => {
  try {
    const existing = await GlobalEducationPage.findOne({ is_active: true });
    if (existing) return res.status(400).json({ success: false, message: 'Global Education page already exists' });
    const page = await GlobalEducationPage.create({ ...req.body, is_active: true });
    return res.status(201).json({ success: true, data: page });
  } catch (error) {
    return res.status(500).json({ success: false, message: 'Failed to create Global Education page', error: error.message });
  }
};

export const updateGlobalEducationPage = async (req, res) => {
  try {
    const page = await GlobalEducationPage.findOne({ is_active: true });
    if (!page) return res.status(404).json({ success: false, message: 'Global Education page not found' });
    await GlobalEducationPage.updateOne({ _id: page._id }, { $set: req.body });
    const updated = await GlobalEducationPage.findById(page._id);
    return res.status(200).json({ success: true, data: updated });
  } catch (error) {
    return res.status(500).json({ success: false, message: 'Failed to update Global Education page', error: error.message });
  }
};

export const reorderGlobalEducationItems = async (req, res) => {
  try {
    const { section, items } = req.body; // 'contributions' | 'values'
    const valid = ['contributions','values'];
    if (!valid.includes(section)) return res.status(400).json({ success:false, message:'Invalid section. Use contributions or values' });
    if (!Array.isArray(items)) return res.status(400).json({ success:false, message:'Items array is required' });
    const page = await GlobalEducationPage.findOne({ is_active: true });
    if (!page) return res.status(404).json({ success:false, message:'Global Education page not found' });
    const updateField = section === 'contributions' ? 'sdgFocusSection.contributions' : 'valuesList';
    for (const item of items) {
      await GlobalEducationPage.updateOne({ _id: page._id, [`${updateField}._id`]: item.id }, { $set: { [`${updateField}.$.display_order`]: item.display_order } });
    }
    const updated = await GlobalEducationPage.findById(page._id);
    return res.status(200).json({ success:true, message:`${section} order updated successfully`, data: updated });
  } catch (error) {
    return res.status(500).json({ success:false, message:'Failed to reorder items', error: error.message });
  }
};

export const uploadGlobalEducationMissionImage = async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ success:false, message:'Image file is required' });
    const page = await GlobalEducationPage.findOne({ is_active: true });
    if (!page) { await deleteSingleImageFromS3(req.file.key); return res.status(404).json({ success:false, message:'Page not found' }); }
    if (page.missionSection?.image) { const old = createS3KeyFromImageUrl(page.missionSection.image); await deleteSingleImageFromS3(old); }
    await GlobalEducationPage.updateOne({ _id: page._id }, { $set: { 'missionSection.image': req.file.location } });
    return res.status(200).json({ success:true, data:{ image: req.file.location } });
  } catch (error) {
    return res.status(500).json({ success:false, message:'Failed to upload image', error: error.message });
  }
};

export const uploadGlobalEducationEquityImage = async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ success:false, message:'Image file is required' });
    const page = await GlobalEducationPage.findOne({ is_active: true });
    if (!page) { await deleteSingleImageFromS3(req.file.key); return res.status(404).json({ success:false, message:'Page not found' }); }
    if (page.equityImpactSection?.image) { const old = createS3KeyFromImageUrl(page.equityImpactSection.image); await deleteSingleImageFromS3(old); }
    await GlobalEducationPage.updateOne({ _id: page._id }, { $set: { 'equityImpactSection.image': req.file.location } });
    return res.status(200).json({ success:true, data:{ image: req.file.location } });
  } catch (error) {
    return res.status(500).json({ success:false, message:'Failed to upload image', error: error.message });
  }
};

export const uploadGlobalEducationBannerImage = async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ success:false, message:'Image file is required' });
    const page = await GlobalEducationPage.findOne({ is_active: true });
    if (!page) { await deleteSingleImageFromS3(req.file.key); return res.status(404).json({ success:false, message:'Page not found' }); }
    if (page.bannerImage) { const old = createS3KeyFromImageUrl(page.bannerImage); await deleteSingleImageFromS3(old); }
    await GlobalEducationPage.updateOne({ _id: page._id }, { $set: { bannerImage: req.file.location } });
    return res.status(200).json({ success:true, data:{ image: req.file.location } });
  } catch (error) {
    return res.status(500).json({ success:false, message:'Failed to upload image', error: error.message });
  }
};

export const deleteGlobalEducationPage = async (req, res) => {
  try {
    const page = await GlobalEducationPage.findOne({ is_active: true });
    if (!page) return res.status(404).json({ success:false, message:'Global Education page not found' });
    if (page.missionSection?.image) { const key = createS3KeyFromImageUrl(page.missionSection.image); await deleteSingleImageFromS3(key); }
    if (page.equityImpactSection?.image) { const key = createS3KeyFromImageUrl(page.equityImpactSection.image); await deleteSingleImageFromS3(key); }
    if (page.bannerImage) { const key = createS3KeyFromImageUrl(page.bannerImage); await deleteSingleImageFromS3(key); }
    await GlobalEducationPage.findByIdAndDelete(page._id);
    return res.status(200).json({ success:true, message:'Global Education page deleted successfully' });
  } catch (error) {
    return res.status(500).json({ success:false, message:'Failed to delete page', error: error.message });
  }
};

// ============================================
// PRIVACY POLICY PAGE ADMIN FUNCTIONS
// ============================================

export const getPrivacyPolicyPageAdmin = async (req, res) => {
  try {
    const page = await PrivacyPolicyPage.findOne({ is_active: true }).select('-__v').lean();
    if (!page) return res.status(404).json({ success:false, message:'Privacy Policy page not found' });
    if (page.sections) page.sections.sort((a,b)=>(a.display_order||0)-(b.display_order||0));
    return res.status(200).json({ success:true, data: page });
  } catch (error) {
    return res.status(500).json({ success:false, message:'Failed to get Privacy Policy page', error: error.message });
  }
};

export const createPrivacyPolicyPage = async (req, res) => {
  try {
    const existing = await PrivacyPolicyPage.findOne({ is_active: true });
    if (existing) return res.status(400).json({ success:false, message:'Privacy Policy page already exists' });
    const page = await PrivacyPolicyPage.create({ ...req.body, is_active: true });
    return res.status(201).json({ success:true, data: page });
  } catch (error) {
    return res.status(500).json({ success:false, message:'Failed to create Privacy Policy page', error: error.message });
  }
};

export const updatePrivacyPolicyPage = async (req, res) => {
  try {
    const page = await PrivacyPolicyPage.findOne({ is_active: true });
    if (!page) return res.status(404).json({ success:false, message:'Privacy Policy page not found' });
    await PrivacyPolicyPage.updateOne({ _id: page._id }, { $set: req.body });
    const updated = await PrivacyPolicyPage.findById(page._id);
    return res.status(200).json({ success:true, data: updated });
  } catch (error) {
    return res.status(500).json({ success:false, message:'Failed to update Privacy Policy page', error: error.message });
  }
};

export const reorderPrivacyPolicyItems = async (req, res) => {
  try {
    const { items } = req.body; // [{id, display_order}]
    if (!Array.isArray(items)) return res.status(400).json({ success:false, message:'Items array is required' });
    const page = await PrivacyPolicyPage.findOne({ is_active: true });
    if (!page) return res.status(404).json({ success:false, message:'Privacy Policy page not found' });
    for (const item of items) {
      await PrivacyPolicyPage.updateOne({ _id: page._id, 'sections._id': item.id }, { $set: { 'sections.$.display_order': item.display_order } });
    }
    const updated = await PrivacyPolicyPage.findById(page._id);
    return res.status(200).json({ success:true, message:'Order updated successfully', data: updated });
  } catch (error) {
    return res.status(500).json({ success:false, message:'Failed to reorder items', error: error.message });
  }
};

export const uploadPrivacyPolicyHeroImage = async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ success:false, message:'Image file is required' });
    const page = await PrivacyPolicyPage.findOne({ is_active: true });
    if (!page) { await deleteSingleImageFromS3(req.file.key); return res.status(404).json({ success:false, message:'Page not found' }); }
    if (page.heroSection?.heroImage) { const old = createS3KeyFromImageUrl(page.heroSection.heroImage); await deleteSingleImageFromS3(old); }
    await PrivacyPolicyPage.updateOne({ _id: page._id }, { $set: { 'heroSection.heroImage': req.file.location } });
    return res.status(200).json({ success:true, data:{ image: req.file.location } });
  } catch (error) {
    return res.status(500).json({ success:false, message:'Failed to upload image', error: error.message });
  }
};

export const deletePrivacyPolicyPage = async (req, res) => {
  try {
    const page = await PrivacyPolicyPage.findOne({ is_active: true });
    if (!page) return res.status(404).json({ success:false, message:'Privacy Policy page not found' });
    if (page.heroSection?.heroImage) { const key = createS3KeyFromImageUrl(page.heroSection.heroImage); await deleteSingleImageFromS3(key); }
    await PrivacyPolicyPage.findByIdAndDelete(page._id);
    return res.status(200).json({ success:true, message:'Privacy Policy page deleted successfully' });
  } catch (error) {
    return res.status(500).json({ success:false, message:'Failed to delete page', error: error.message });
  }
};

export const uploadGlobalEducationHeroImage = async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ success:false, message:'Image file is required' });
    const page = await GlobalEducationPage.findOne({ is_active: true });
    if (!page) { await deleteSingleImageFromS3(req.file.key); return res.status(404).json({ success:false, message:'Page not found' }); }
    if (page.heroSection?.heroImage) { const old = createS3KeyFromImageUrl(page.heroSection.heroImage); await deleteSingleImageFromS3(old); }
    await GlobalEducationPage.updateOne({ _id: page._id }, { $set: { 'heroSection.heroImage': req.file.location } });
    return res.status(200).json({ success:true, data:{ image: req.file.location } });
  } catch (error) {
    return res.status(500).json({ success:false, message:'Failed to upload image', error: error.message });
  }
};

// ============================================
// ADULT EDUCATION PAGE ADMIN FUNCTIONS
// ============================================

export const getAdultEducationPageAdmin = async (req, res) => {
  try {
    const page = await AdultEducationPage.findOne({ is_active: true }).select('-__v').lean();
    if (!page) {
      return res.status(404).json({ success: false, message: 'Adult Education page data not found' });
    }
    if (page.learningModel?.features) {
      page.learningModel.features.sort((a, b) => (a.display_order || 0) - (b.display_order || 0));
    }
    if (page.focusAreas?.areas) {
      page.focusAreas.areas.sort((a, b) => (a.display_order || 0) - (b.display_order || 0));
    }
    return res.status(200).json({ success: true, data: page });
  } catch (error) {
    console.error('Error getting adult education page:', error);
    return res.status(500).json({ success: false, message: 'Failed to get Adult Education page', error: error.message });
  }
};

export const createAdultEducationPage = async (req, res) => {
  try {
    const existing = await AdultEducationPage.findOne({ is_active: true });
    if (existing) {
      return res.status(400).json({ success: false, message: 'Adult Education page already exists' });
    }
    const page = await AdultEducationPage.create({ ...req.body, is_active: true });
    return res.status(201).json({ success: true, data: page });
  } catch (error) {
    console.error('Error creating adult education page:', error);
    return res.status(500).json({ success: false, message: 'Failed to create Adult Education page', error: error.message });
  }
};

export const updateAdultEducationPage = async (req, res) => {
  try {
    const page = await AdultEducationPage.findOne({ is_active: true });
    if (!page) {
      return res.status(404).json({ success: false, message: 'Adult Education page not found' });
    }
    await AdultEducationPage.updateOne({ _id: page._id }, { $set: req.body });
    const updated = await AdultEducationPage.findById(page._id);
    return res.status(200).json({ success: true, data: updated });
  } catch (error) {
    console.error('Error updating adult education page:', error);
    return res.status(500).json({ success: false, message: 'Failed to update Adult Education page', error: error.message });
  }
};

export const reorderAdultEducationItems = async (req, res) => {
  try {
    const { section, items } = req.body; // items: [{ id, display_order }]
    const validSections = ['features', 'areas'];
    if (!validSections.includes(section)) {
      return res.status(400).json({ success: false, message: 'Invalid section. Must be one of: features, areas' });
    }
    if (!Array.isArray(items)) {
      return res.status(400).json({ success: false, message: 'Items array is required' });
    }
    const page = await AdultEducationPage.findOne({ is_active: true });
    if (!page) {
      return res.status(404).json({ success: false, message: 'Adult Education page not found' });
    }

    const updateField = section === 'features' ? 'learningModel.features' : 'focusAreas.areas';
    for (const item of items) {
      await AdultEducationPage.updateOne(
        { _id: page._id, [`${updateField}._id`]: item.id },
        { $set: { [`${updateField}.$.display_order`]: item.display_order } }
      );
    }
    const updated = await AdultEducationPage.findById(page._id);
    return res.status(200).json({ success: true, message: `${section} order updated successfully`, data: updated });
  } catch (error) {
    console.error('Error reordering adult education items:', error);
    return res.status(500).json({ success: false, message: 'Failed to reorder items', error: error.message });
  }
};

export const uploadAdultEducationHeroImage = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ success: false, message: 'Image file is required' });
    }
    const page = await AdultEducationPage.findOne({ is_active: true });
    if (!page) {
      // cleanup newly uploaded
      await deleteSingleImageFromS3(req.file.key);
      return res.status(404).json({ success: false, message: 'Adult Education page not found' });
    }
    
    // Store old image URL before updating
    const oldImageUrl = page.introduction?.heroImage;
    
    try {
      // Update database with new image URL
      await AdultEducationPage.updateOne({ _id: page._id }, { $set: { 'introduction.heroImage': req.file.location } });
      
      // Delete old image from S3 after successful database update
      if (oldImageUrl) {
        const oldKey = createS3KeyFromImageUrl(oldImageUrl);
        await deleteSingleImageFromS3(oldKey);
      }
      
      return res.status(200).json({ success: true, data: { image: req.file.location } });
    } catch (dbError) {
      // If database update fails, clean up the newly uploaded file
      console.error('Database update failed, cleaning up uploaded file:', dbError);
      await deleteSingleImageFromS3(req.file.key);
      throw dbError;
    }
  } catch (error) {
    console.error('Error uploading hero image (Adult Education):', error);
    // Ensure cleanup if file was uploaded but error occurred
    if (req.file && req.file.key) {
      try {
        await deleteSingleImageFromS3(req.file.key);
      } catch (cleanupError) {
        console.error('Error cleaning up uploaded file:', cleanupError);
      }
    }
    return res.status(500).json({ success: false, message: 'Failed to upload image', error: error.message });
  }
};

export const uploadAdultEducationWhyImage = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ success: false, message: 'Image file is required' });
    }
    const page = await AdultEducationPage.findOne({ is_active: true });
    if (!page) {
      await deleteSingleImageFromS3(req.file.key);
      return res.status(404).json({ success: false, message: 'Adult Education page not found' });
    }
    
    // Store old image URL before updating
    const oldImageUrl = page.whyItMatters?.image;
    
    try {
      // Update database with new image URL
      await AdultEducationPage.updateOne({ _id: page._id }, { $set: { 'whyItMatters.image': req.file.location } });
      
      // Delete old image from S3 after successful database update
      if (oldImageUrl) {
        const oldKey = createS3KeyFromImageUrl(oldImageUrl);
        await deleteSingleImageFromS3(oldKey);
      }
      
      return res.status(200).json({ success: true, data: { image: req.file.location } });
    } catch (dbError) {
      // If database update fails, clean up the newly uploaded file
      console.error('Database update failed, cleaning up uploaded file:', dbError);
      await deleteSingleImageFromS3(req.file.key);
      throw dbError;
    }
  } catch (error) {
    console.error('Error uploading why image (Adult Education):', error);
    // Ensure cleanup if file was uploaded but error occurred
    if (req.file && req.file.key) {
      try {
        await deleteSingleImageFromS3(req.file.key);
      } catch (cleanupError) {
        console.error('Error cleaning up uploaded file:', cleanupError);
      }
    }
    return res.status(500).json({ success: false, message: 'Failed to upload image', error: error.message });
  }
};

export const deleteAdultEducationPage = async (req, res) => {
  try {
    const page = await AdultEducationPage.findOne({ is_active: true });
    if (!page) {
      return res.status(404).json({ success: false, message: 'Adult Education page not found' });
    }
    if (page.introduction?.heroImage) {
      const key = createS3KeyFromImageUrl(page.introduction.heroImage);
      await deleteSingleImageFromS3(key);
    }
    if (page.whyItMatters?.image) {
      const key = createS3KeyFromImageUrl(page.whyItMatters.image);
      await deleteSingleImageFromS3(key);
    }
    await AdultEducationPage.findByIdAndDelete(page._id);
    return res.status(200).json({ success: true, message: 'Adult Education page deleted successfully' });
  } catch (error) {
    console.error('Error deleting adult education page:', error);
    return res.status(500).json({ success: false, message: 'Failed to delete page', error: error.message });
  }
};

// ============================================
// MADRASA PAGE ADMIN FUNCTIONS
// ============================================

export const getMadrasaPageAdmin = async (req, res) => {
  try {
    const page = await MadrasaPage.findOne({ is_active: true }).lean();
    if (!page) return res.status(404).json({ success:false, message:'Madrasa page data not found' });
    const sort = (arr)=>arr?.sort((a,b)=> (a.display_order||0)-(b.display_order||0));
    if (page.objectivesSection?.cards) sort(page.objectivesSection.cards);
    if (page.featuresSection?.cards) sort(page.featuresSection.cards);
    if (page.impactSection?.cards) sort(page.impactSection.cards);
    if (page.challengesSection?.cards) sort(page.challengesSection.cards);
    return res.status(200).json({ success:true, data: page });
  } catch (e) { return res.status(500).json({ success:false, message:'Failed to fetch', error:e.message }); }
};

export const createMadrasaPage = async (req, res) => {
  try {
    const exists = await MadrasaPage.findOne({ is_active: true });
    if (exists) return res.status(400).json({ success:false, message:'Madrasa page already exists. Use update instead.' });
    const doc = await MadrasaPage.create(req.body);
    return res.status(201).json({ success:true, data: doc });
  } catch (e) { return res.status(500).json({ success:false, message:'Failed to create page', error:e.message }); }
};

export const updateMadrasaPage = async (req, res) => {
  try {
    let page = await MadrasaPage.findOne({ is_active: true });
    if (!page) { const created = await MadrasaPage.create(req.body); return res.status(201).json({ success:true, data: created }); }
    const body = req.body;
    if (body.heroSection) page.heroSection = body.heroSection;
    if (body.introduction) page.introduction = body.introduction;
    if (body.commitmentSection) page.commitmentSection = body.commitmentSection;
    if (body.objectivesSection) page.objectivesSection = body.objectivesSection;
    if (body.featuresSection) page.featuresSection = body.featuresSection;
    if (body.imageSection1) page.imageSection1 = body.imageSection1;
    if (body.impactSection) page.impactSection = body.impactSection;
    if (body.imageSection2) page.imageSection2 = body.imageSection2;
    if (body.challengesSection) page.challengesSection = body.challengesSection;
    if (body.ctaSection) page.ctaSection = body.ctaSection;
    await page.save();
    return res.status(200).json({ success:true, message:'Madrasa page updated successfully', data: page });
  } catch (e) { return res.status(500).json({ success:false, message:'Failed to update page', error:e.message }); }
};

export const reorderMadrasaItems = async (req, res) => {
  try {
    const { section, items } = req.body;
    const valid = ['objectives','features','impact','challenges'];
    if (!valid.includes(section)) return res.status(400).json({ success:false, message:'Invalid section' });
    const page = await MadrasaPage.findOne({ is_active: true });
    if (!page) return res.status(404).json({ success:false, message:'Page not found' });
    const field = section==='objectives' ? 'objectivesSection.cards' : section==='features' ? 'featuresSection.cards' : section==='impact' ? 'impactSection.cards' : 'challengesSection.cards';
    for (const it of items) {
      await MadrasaPage.updateOne({ _id: page._id, [`${field}._id`]: it.id }, { $set: { [`${field}.$.display_order`]: it.display_order } });
    }
    const updated = await MadrasaPage.findById(page._id);
    return res.status(200).json({ success:true, message:'Items reordered successfully', data: updated });
  } catch (e) { return res.status(500).json({ success:false, message:'Failed to reorder items', error:e.message }); }
};

export const uploadMadrasaHeroImage = async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ success:false, message:'Image file is required' });
    const page = await MadrasaPage.findOne({ is_active: true });
    if (!page) { await deleteSingleImageFromS3(req.file.key); return res.status(404).json({ success:false, message:'Page not found. Create page first.'}); }
    if (page.heroSection?.heroImage) { const old = createS3KeyFromImageUrl(page.heroSection.heroImage); await deleteSingleImageFromS3(old); }
    await MadrasaPage.updateOne({ _id: page._id }, { $set: { 'heroSection.heroImage': req.file.location } });
    return res.status(200).json({ success:true, data:{ image: req.file.location } });
  } catch (e) { if (req.file) await deleteSingleImageFromS3(req.file.key); return res.status(500).json({ success:false, message:'Failed to upload hero image', error:e.message }); }
};

export const uploadMadrasaImage1 = async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ success:false, message:'Image file is required' });
    const page = await MadrasaPage.findOne({ is_active: true });
    if (!page) { await deleteSingleImageFromS3(req.file.key); return res.status(404).json({ success:false, message:'Page not found. Create page first.'}); }
    if (page.imageSection1?.image) { const old = createS3KeyFromImageUrl(page.imageSection1.image); await deleteSingleImageFromS3(old); }
    await MadrasaPage.updateOne({ _id: page._id }, { $set: { 'imageSection1.image': req.file.location } });
    return res.status(200).json({ success:true, data:{ image: req.file.location } });
  } catch (e) { if (req.file) await deleteSingleImageFromS3(req.file.key); return res.status(500).json({ success:false, message:'Failed to upload image', error:e.message }); }
};

export const uploadMadrasaImage2 = async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ success:false, message:'Image file is required' });
    const page = await MadrasaPage.findOne({ is_active: true });
    if (!page) { await deleteSingleImageFromS3(req.file.key); return res.status(404).json({ success:false, message:'Page not found. Create page first.'}); }
    if (page.imageSection2?.image) { const old = createS3KeyFromImageUrl(page.imageSection2.image); await deleteSingleImageFromS3(old); }
    await MadrasaPage.updateOne({ _id: page._id }, { $set: { 'imageSection2.image': req.file.location } });
    return res.status(200).json({ success:true, data:{ image: req.file.location } });
  } catch (e) { if (req.file) await deleteSingleImageFromS3(req.file.key); return res.status(500).json({ success:false, message:'Failed to upload image', error:e.message }); }
};

// ============================================
// TEACHERS TRAINING PAGE ADMIN FUNCTIONS
// ============================================

export const getTeachersTrainingPageAdmin = async (req, res) => {
  try {
    const page = await TeachersTrainingPage.findOne({ is_active: true }).lean();
    if (!page) return res.status(404).json({ success:false, message:'Teachers Training page data not found' });
    const sort = (arr)=>arr?.sort((a,b)=> (a.display_order||0)-(b.display_order||0));
    if (page.trainingPathwaysSection?.items) sort(page.trainingPathwaysSection.items);
    if (page.coreComponentsSection?.items) sort(page.coreComponentsSection.items);
    if (page.skillsGainedSection?.items) sort(page.skillsGainedSection.items);
    if (page.whyChooseUsSection?.items) sort(page.whyChooseUsSection.items);
    return res.status(200).json({ success:true, data: page });
  } catch (e) { return res.status(500).json({ success:false, message:'Failed to fetch', error:e.message }); }
};

export const createTeachersTrainingPage = async (req, res) => {
  try {
    const exists = await TeachersTrainingPage.findOne({ is_active: true });
    if (exists) return res.status(400).json({ success:false, message:'Page already exists. Use update instead.' });
    const doc = await TeachersTrainingPage.create(req.body);
    return res.status(201).json({ success:true, data: doc });
  } catch (e) { return res.status(500).json({ success:false, message:'Failed to create page', error:e.message }); }
};

export const updateTeachersTrainingPage = async (req, res) => {
  try {
    let page = await TeachersTrainingPage.findOne({ is_active: true });
    if (!page) { const created = await TeachersTrainingPage.create(req.body); return res.status(201).json({ success:true, data: created }); }
    const b = req.body;
    if (b.heroSection) page.heroSection = b.heroSection;
    if (b.missionSection) page.missionSection = b.missionSection;
    if (b.trainingPathwaysSection) page.trainingPathwaysSection = b.trainingPathwaysSection;
    if (b.coreComponentsSection) page.coreComponentsSection = b.coreComponentsSection;
    if (b.skillsGainedSection) page.skillsGainedSection = b.skillsGainedSection;
    if (b.whyChooseUsSection) page.whyChooseUsSection = b.whyChooseUsSection;
    if (b.imageSection) page.imageSection = b.imageSection;
    if (b.ctaSection) page.ctaSection = b.ctaSection;
    await page.save();
    return res.status(200).json({ success:true, message:'Teachers Training page updated successfully', data: page });
  } catch (e) { return res.status(500).json({ success:false, message:'Failed to update page', error:e.message }); }
};

export const reorderTeachersTrainingItems = async (req, res) => {
  try {
    const { section, items } = req.body;
    const valid = ['trainingPathways','coreComponents','skills','whyChooseUs'];
    if (!valid.includes(section)) return res.status(400).json({ success:false, message:'Invalid section' });
    const page = await TeachersTrainingPage.findOne({ is_active: true });
    if (!page) return res.status(404).json({ success:false, message:'Page not found' });
    const field = section==='trainingPathways' ? 'trainingPathwaysSection.items' : section==='coreComponents' ? 'coreComponentsSection.items' : section==='skills' ? 'skillsGainedSection.items' : 'whyChooseUsSection.items';
    for (const it of items) {
      await TeachersTrainingPage.updateOne({ _id: page._id, [`${field}._id`]: it.id }, { $set: { [`${field}.$.display_order`]: it.display_order } });
    }
    const updated = await TeachersTrainingPage.findById(page._id);
    return res.status(200).json({ success:true, message:'Items reordered successfully', data: updated });
  } catch (e) { return res.status(500).json({ success:false, message:'Failed to reorder items', error:e.message }); }
};

export const uploadTeachersTrainingHeroImage = async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ success:false, message:'Image file is required' });
    const page = await TeachersTrainingPage.findOne({ is_active: true });
    if (!page) { await deleteSingleImageFromS3(req.file.key); return res.status(404).json({ success:false, message:'Page not found. Create page first.'}); }
    if (page.heroSection?.heroImage) { const old = createS3KeyFromImageUrl(page.heroSection.heroImage); await deleteSingleImageFromS3(old); }
    await TeachersTrainingPage.updateOne({ _id: page._id }, { $set: { 'heroSection.heroImage': req.file.location } });
    return res.status(200).json({ success:true, data:{ image: req.file.location } });
  } catch (e) { if (req.file) await deleteSingleImageFromS3(req.file.key); return res.status(500).json({ success:false, message:'Failed to upload hero image', error:e.message }); }
};

export const uploadTeachersTrainingImageSection = async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ success:false, message:'Image file is required' });
    const page = await TeachersTrainingPage.findOne({ is_active: true });
    if (!page) { await deleteSingleImageFromS3(req.file.key); return res.status(404).json({ success:false, message:'Page not found. Create page first.'}); }
    if (page.imageSection?.image) { const old = createS3KeyFromImageUrl(page.imageSection.image); await deleteSingleImageFromS3(old); }
    await TeachersTrainingPage.updateOne({ _id: page._id }, { $set: { 'imageSection.image': req.file.location } });
    return res.status(200).json({ success:true, data:{ image: req.file.location } });
  } catch (e) { if (req.file) await deleteSingleImageFromS3(req.file.key); return res.status(500).json({ success:false, message:'Failed to upload image', error:e.message }); }
};

// ============================================
// BE A PARTNER PAGE ADMIN FUNCTIONS
// ============================================

export const getBeAPartnerPageAdmin = async (req, res) => {
  try {
    const page = await BeAPartnerPage.findOne({ is_active: true }).lean();
    if (!page) return res.status(404).json({ success:false, message:'Be A Partner page data not found' });
    const sort = (arr)=>arr?.sort((a,b)=> (a.display_order||0)-(b.display_order||0));
    if (page.whySupportSection?.points) sort(page.whySupportSection.points);
    if (page.waysToHelpSection?.points) sort(page.waysToHelpSection.points);
    return res.status(200).json({ success:true, data: page });
  } catch (e) { return res.status(500).json({ success:false, message:'Failed to fetch', error:e.message }); }
};

export const createBeAPartnerPage = async (req, res) => {
  try {
    const exists = await BeAPartnerPage.findOne({ is_active: true });
    if (exists) return res.status(400).json({ success:false, message:'Page already exists. Use update instead.' });
    const doc = await BeAPartnerPage.create(req.body);
    return res.status(201).json({ success:true, data: doc });
  } catch (e) { return res.status(500).json({ success:false, message:'Failed to create page', error:e.message }); }
};

export const updateBeAPartnerPage = async (req, res) => {
  try {
    let page = await BeAPartnerPage.findOne({ is_active: true });
    if (!page) { const created = await BeAPartnerPage.create(req.body); return res.status(201).json({ success:true, data: created }); }
    const b = req.body;
    if (b.heroSection) page.heroSection = b.heroSection;
    if (b.introSection) page.introSection = b.introSection;
    if (b.whySupportSection) page.whySupportSection = b.whySupportSection;
    if (b.waysToHelpSection) page.waysToHelpSection = b.waysToHelpSection;
    if (b.ctaSection) page.ctaSection = b.ctaSection;
    await page.save();
    return res.status(200).json({ success:true, message:'Be A Partner page updated successfully', data: page });
  } catch (e) { return res.status(500).json({ success:false, message:'Failed to update page', error:e.message }); }
};

export const reorderBeAPartnerItems = async (req, res) => {
  try {
    const { section, items } = req.body; // section: 'why' | 'ways'
    const valid = ['why','ways'];
    if (!valid.includes(section)) return res.status(400).json({ success:false, message:'Invalid section' });
    const page = await BeAPartnerPage.findOne({ is_active: true });
    if (!page) return res.status(404).json({ success:false, message:'Page not found' });
    const field = section==='why' ? 'whySupportSection.points' : 'waysToHelpSection.points';
    for (const it of items) {
      await BeAPartnerPage.updateOne({ _id: page._id, [`${field}._id`]: it.id }, { $set: { [`${field}.$.display_order`]: it.display_order } });
    }
    const updated = await BeAPartnerPage.findById(page._id);
    return res.status(200).json({ success:true, message:'Items reordered successfully', data: updated });
  } catch (e) { return res.status(500).json({ success:false, message:'Failed to reorder items', error:e.message }); }
};

export const uploadBeAPartnerHeaderImage = async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ success:false, message:'Image file is required' });
    const page = await BeAPartnerPage.findOne({ is_active: true });
    if (!page) { await deleteSingleImageFromS3(req.file.key); return res.status(404).json({ success:false, message:'Page not found. Create page first.'}); }
    if (page.heroSection?.headerImage) { const old = createS3KeyFromImageUrl(page.heroSection.headerImage); await deleteSingleImageFromS3(old); }
    await BeAPartnerPage.updateOne({ _id: page._id }, { $set: { 'heroSection.headerImage': req.file.location } });
    return res.status(200).json({ success:true, data:{ image: req.file.location } });
  } catch (e) { if (req.file) await deleteSingleImageFromS3(req.file.key); return res.status(500).json({ success:false, message:'Failed to upload image', error:e.message }); }
};

