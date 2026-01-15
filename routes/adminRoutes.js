import express from 'express';
import { protect } from '../middleware/authMiddleware.js';

import {
  getSoftSkillTrainingPageAdmin,
  createSoftSkillTrainingPage,
  updateSoftSkillTrainingPage,
  reorderSoftSkillTrainingItems,
  uploadSoftSkillTrainingHeroImage,
  deleteSoftSkillTrainingPage,

  getTechnicalSkillTrainingPageAdmin,
  createTechnicalSkillTrainingPage,
  updateTechnicalSkillTrainingPage,
  reorderTechnicalSkillTrainingItems,
  uploadTechnicalSkillTrainingHeroImage,
  uploadTechnicalSkillTrainingModeImage,
  deleteTechnicalSkillTrainingPage,

  createAdmin,
  assignStudent,
  updateStudentProgress,
  createCourse,
  getAllCourses,
  getAllDonors,
  loginAdmin,
  getAdmin,
  getAllAdmins,
  updateAdmin,
  deleteAdmin,
  updateCourse,
  deleteCourse,

  getAllInstitutions,
  createOrUpdateCarousel,

  addVideoCard,
  updateVideoCard,
  deleteVideoCard,

  addHeroSection,
  updateHeroSection,
  deleteHeroSection,

  addBulletPoint,
  updateBulletPoint,
  deleteBulletPoint,

  addSection,
  updateSection,
  deleteSection,
  getAllSections,
  getSectionById,

  addReferredBy,
  getOneReferredBy,
  updateReferredBy,
  deleteReferredBy,

  downloadBackup,
  getHomepageContent,

  getAllCardTestimonials,
  createCardTestimonial,
  updateCardTestimonial,
  deleteCardTestimonial,
  getAllVideoTestimonials,
  createVideoTestimonial,
  updateVideoTestimonial,
  deleteVideoTestimonial,
  reorderTestimonials,
  getAllFeaturedStories,
  createFeaturedStory,
  updateFeaturedStory,
  deleteFeaturedStory,

  getAllLeadership,
  getLeadershipById,
  createLeadership,
  updateLeadership,
  deleteLeadership,
  reorderLeadership,

  getAllGalleryItems,
  getGalleryItemById,
  createGalleryItem,
  updateGalleryItem,
  deleteGalleryItem,
  reorderGalleryItems,
  toggleGalleryItemStatus,

  getAllPartnerInstitutions,
  reorderPartnerInstitutions,
  createPartnerInstitution,
  updatePartnerInstitution,
  deletePartnerInstitution,

  getAllGlobalPartners,
  getGlobalPartnerById,
  createGlobalPartner,
  updateGlobalPartner,
  deleteGlobalPartner,
  reorderGlobalPartners,

  getCareerPageAdmin,
  createCareerPage,
  updateCareerPage,
  updateCareerPageSection,
  addCareerBenefit,
  updateCareerBenefit,
  deleteCareerBenefit,
  addCareerJobCategory,
  deleteCareerJobCategory,
  deleteCareerPage,

  getIntroductionPageAdmin,
  createIntroductionPage,
  updateIntroductionPage,
  deleteIntroductionPage,

  getElementaryMiddleSchoolPageAdmin,
  createElementaryMiddleSchoolPage,
  updateElementaryMiddleSchoolPage,
  reorderElementaryMiddleSchoolItems,
  uploadElementaryMiddleSchoolHeroImage,
  uploadElementaryMiddleSchoolReachImage,
  uploadElementaryMiddleSchoolModeImage,
  deleteElementaryMiddleSchoolPage,

  getSlumChildrenPageAdmin,
  createSlumChildrenPage,
  updateSlumChildrenPage,
  reorderSlumChildrenItems,
  uploadSlumChildrenHeroImage,
  deleteSlumChildrenPage,

  getPublicGovernmentSchoolPageAdmin,
  createPublicGovernmentSchoolPage,
  updatePublicGovernmentSchoolPage,
  reorderPublicGovernmentSchoolItems,
  uploadPublicGovernmentSchoolHeroImage,
  uploadPublicGovernmentSchoolBlendedImage,
  uploadPublicGovernmentSchoolCaseStudyImage,
  uploadPublicGovernmentSchoolCaseStudyPDF,
  deletePublicGovernmentSchoolPage,

  getOutOfSchoolDropoutPageAdmin,
  createOutOfSchoolDropoutPage,
  updateOutOfSchoolDropoutPage,
  reorderOutOfSchoolDropoutItems,
  uploadOutOfSchoolDropoutHeroImage,
  uploadOutOfSchoolDropoutFeaturedImage,
  uploadOutOfSchoolDropoutSecondImage,
  uploadOutOfSchoolDropoutGalleryImage,

  getNeiUsaIntroductionPageAdmin,
  createNeiUsaIntroductionPage,
  updateNeiUsaIntroductionPage,
  reorderNeiUsaIntroductionItems,
  uploadNeiUsaIntroductionAboutImage,
  uploadNeiUsaIntroductionWhoWeServeImage,
  uploadNeiUsaIntroductionWhatWeOfferImage,
  deleteNeiUsaIntroductionPage,

  getGirlsEducationPageAdmin,
  createGirlsEducationPage,
  updateGirlsEducationPage,
  reorderGirlsEducationItems,
  uploadGirlsEducationHeroImage,
  uploadGirlsEducationImpactImage,
  deleteGirlsEducationPage,

  // Adult Education
  getAdultEducationPageAdmin,
  createAdultEducationPage,
  updateAdultEducationPage,
  reorderAdultEducationItems,
  uploadAdultEducationHeroImage,
  uploadAdultEducationWhyImage,
  deleteAdultEducationPage,

  getMadrasaPageAdmin,
  createMadrasaPage,
  updateMadrasaPage,
  reorderMadrasaItems,
  uploadMadrasaHeroImage,
  uploadMadrasaImage1,
  uploadMadrasaImage2,
  // Teachers Training
  getTeachersTrainingPageAdmin,
  createTeachersTrainingPage,
  updateTeachersTrainingPage,
  reorderTeachersTrainingItems,
  uploadTeachersTrainingHeroImage,
  uploadTeachersTrainingImageSection
  ,
  // Be A Partner
  getBeAPartnerPageAdmin,
  createBeAPartnerPage,
  updateBeAPartnerPage,
  reorderBeAPartnerItems,
  uploadBeAPartnerHeaderImage as uploadBeAPartnerHeaderImageCtrl
} from '../controllers/adminController.js';
// Import Global Education admin handlers
import {
  getGlobalEducationPageAdmin,
  createGlobalEducationPage,
  updateGlobalEducationPage,
  reorderGlobalEducationItems,
  uploadGlobalEducationHeroImage,
  uploadGlobalEducationMissionImage,
  uploadGlobalEducationEquityImage,
  uploadGlobalEducationBannerImage,
  deleteGlobalEducationPage
} from '../controllers/adminController.js';

import {
  getPrivacyPolicyPageAdmin,
  createPrivacyPolicyPage,
  updatePrivacyPolicyPage,
  reorderPrivacyPolicyItems,
  uploadPrivacyPolicyHeroImage,
  deletePrivacyPolicyPage
} from '../controllers/adminController.js';

import {
  getLeadershipPageAdmin,
  createLeadershipPage,
  updateLeadershipPage,
  uploadLeadershipHeroImage
} from '../controllers/leadershipPageController.js';


import {
  getRemoteLearningPageAdmin,
  createRemoteLearningPage,
  updateRemoteLearningPage,
  deleteRemoteLearningPage,
  uploadHeaderImage as uploadRemoteLearningHeaderImage
} from '../controllers/remoteLearningPageController.js';
import {
  getBlendedLearningPageAdmin,
  createBlendedLearningPage,
  updateBlendedLearningPage,
  deleteBlendedLearningPage,
  uploadHeaderImage as uploadBlendedLearningHeaderImageCtrl,
  uploadSupportingImage
} from '../controllers/blendedLearningPageController.js';
import {
  getDOPPage,
  getAdminDOPPage,
  createOrUpdateDOPPage,
  updateDOPPage,
  uploadHeroImage as uploadDOPHeroImageCtrl,
  uploadIntroductionImage as uploadDOPIntroductionImageCtrl,
  uploadFounderImage as uploadDOPFounderImageCtrl,
  uploadFeatureImage as uploadDOPFeatureImageCtrl
} from '../controllers/discourseOrientedPedagogyPageController.js';
import {
  getApplicationOfTechnologyPage,
  getAdminApplicationOfTechnologyPage,
  createOrUpdateApplicationOfTechnologyPage,
  updateApplicationOfTechnologyPage,
  uploadHeroImage as uploadAppTechHeroImageCtrl,
  uploadDigitalClassroomImage as uploadAppTechDigitalClassroomImageCtrl,
  uploadOnboardingImage as uploadAppTechOnboardingImageCtrl,
  uploadAIImage as uploadAppTechAIImageCtrl
} from '../controllers/applicationOfTechnologyPageController.js';
import {
  getAdminReportsFinancialsPage,
  createOrUpdateReportsFinancialsPage,
  updateReportsFinancialsPage,
  uploadHeroImage as uploadReportsFinancialsHeroImageCtrl,
  uploadImpactReportPDF as uploadImpactReportPDFCtrl
} from '../controllers/reportsFinancialsPageController.js';
import {
  getAllSubscribes,
  getSubscribeById,
  updateSubscribe,
  deleteSubscribe,
  deleteMultipleSubscribes
} from '../controllers/subscribeController.js';
import {
  getAllContactInquiries,
  getContactInquiryById,
  updateContactInquiry,
  deleteContactInquiry,
  deleteMultipleContactInquiries,
  getContactInquiryStats,
  getContactInfoAdmin,
  updateContactInfo
} from '../controllers/contactController.js';
import {
  getAllVolunteersAdmin,
  getVolunteerById,
  deleteVolunteer,
  deleteMultipleVolunteers,
  getVolunteerStats
} from '../controllers/volunteerController.js';
import {
  getHomePageForAdmin,
  createOrUpdateHomePage,
  updateBannerSection,
  uploadBannerSlides,
  updateOurMissionSection,
  uploadOurMissionImage,
  uploadLeadershipImage,
  updateInnovationSection,
  uploadInnovationImage,
  updateGlobalProgramsSection,
  uploadGlobalProgramsImage,
  updateStatisticsSection,
  updateTestimonialsSection,
  uploadTestimonialImage,
  deleteHomePage,
  uploadStatisticsBackgroundImage
} from '../controllers/homePageController.js';
import {
  createSocialEmbed,
  getSocialEmbeds,
  toggleSocialEmbedStatus,
  updateSocialEmbed,
  deleteSocialEmbed,
} from '../controllers/socialEmbedController.js';

import upload, {
  uploadAppTechAIImage,
  uploadAppTechDigitalClassroomImage,
  uploadAppTechHeroImage,
  uploadAppTechOnboardingImage,
  uploadBlendedLearningHeaderImage as uploadBlendedLearningHeaderImageMiddleware,
  uploadBlendedLearningSupportingImage,
  uploadCarouselImages,
  uploadDOPFeatureImage,
  uploadDOPFounderImage,
  uploadDOPHeroImage,
  uploadDOPIntroductionImage,
  uploadElementaryMiddleSchoolHeroImage as uploadElementaryMiddleSchoolHeroImageMiddleware,
  uploadElementaryMiddleSchoolModeImage as uploadElementaryMiddleSchoolModeImageMiddleware,
  uploadElementaryMiddleSchoolReachImage as uploadElementaryMiddleSchoolReachImageMiddleware,
  uploadGalleryImage,
  uploadGirlsEducationHeroImage as uploadGirlsEducationHeroImageMiddleware,
  uploadGirlsEducationImpactImage as uploadGirlsEducationImpactImageMiddleware,
  uploadImpactReportPDF,
  uploadLeadershipImage as uploadLeadershipImageMiddleware,
  uploadMadrasaHeroImage as uploadMadrasaHeroImageMiddleware,
  uploadMadrasaImage1 as uploadMadrasaImage1Middleware,
  uploadMadrasaImage2 as uploadMadrasaImage2Middleware,
  uploadNeiUsaIntroductionAboutImage as uploadNeiUsaIntroductionAboutImageMiddleware,
  uploadNeiUsaIntroductionWhatWeOfferImage as uploadNeiUsaIntroductionWhatWeOfferImageMiddleware,
  uploadNeiUsaIntroductionWhoWeServeImage as uploadNeiUsaIntroductionWhoWeServeImageMiddleware,
  uploadOutOfSchoolDropoutFeaturedImage as uploadOutOfSchoolDropoutFeaturedImageMiddleware,
  uploadOutOfSchoolDropoutHeroImage as uploadOutOfSchoolDropoutHeroImageMiddleware,
  uploadOutOfSchoolDropoutSecondImage as uploadOutOfSchoolDropoutSecondImageMiddleware,
  uploadOutOfSchoolDropoutGalleryImage as uploadOutOfSchoolDropoutGalleryImageMiddleware,
  uploadPartnerInstitutionImages,
  uploadPartneringInstitutionPageImage,
  uploadPublicGovernmentSchoolBlendedImage as uploadPublicGovernmentSchoolBlendedImageMiddleware,
  uploadPublicGovernmentSchoolCaseStudyImage as uploadPublicGovernmentSchoolCaseStudyImageMiddleware,
  uploadPublicGovernmentSchoolCaseStudyPDF as uploadPublicGovernmentSchoolCaseStudyPDFMiddleware,
  uploadPublicGovernmentSchoolHeroImage as uploadPublicGovernmentSchoolHeroImageMiddleware,
  uploadRemoteLearningHeaderImage as uploadRemoteLearningHeaderImageMiddleware,
  uploadReportsFinancialsHeroImage,
  uploadSectionsImage,
  uploadSlumChildrenHeroImage as uploadSlumChildrenHeroImageMiddleware,
  uploadSoftSkillTrainingHeroImage as uploadSoftSkillTrainingHeroImageMiddleware,
  uploadTechnicalSkillTrainingHeroImageMiddleware,
  uploadTechnicalSkillTrainingModeImageMiddleware,
  uploadAdultEducationHeroImage as uploadAdultEducationHeroImageMiddleware,
  uploadAdultEducationWhyImage as uploadAdultEducationWhyImageMiddleware,
  uploadGlobalEducationMissionImage as uploadGlobalEducationMissionImageMiddleware,
  uploadGlobalEducationEquityImage as uploadGlobalEducationEquityImageMiddleware,
  uploadGlobalEducationBannerImage as uploadGlobalEducationBannerImageMiddleware,
  uploadGlobalEducationHeroImage as uploadGlobalEducationHeroImageMiddleware,
  uploadPrivacyPolicyHeroImage as uploadPrivacyPolicyHeroImageMiddleware,
  uploadHomeStatisticsBackgroundImage as uploadHomeStatisticsBackgroundImageMiddleware,
  uploadTestimonialsImage,
  uploadHomepageBannerSlides,
  uploadHomepageOurMissionImage,
  uploadHomepageLeadershipImage,
  uploadHomepageInnovationImage,
  uploadHomepageGlobalProgramsImage,
  uploadHomepageTestimonialImage,
  uploadVideoThumbnail,
  uploadBeAPartnerHeaderImage,
  // Teachers Training uploads
  uploadTeachersTrainingHeroImageMiddleware,
  uploadTeachersTrainingImageSectionMiddleware
} from '../middleware/upload.js';


const adminRoutes = express.Router();

adminRoutes.post('/auth/login', loginAdmin);
adminRoutes.post('/create-admin', protect, createAdmin);
adminRoutes.put('/edit/:id', protect, updateAdmin);
adminRoutes.delete('/delete/:id', protect, deleteAdmin);
adminRoutes.get('/getAll-admin', protect, getAllAdmins);
adminRoutes.get('/get-admin', protect, getAdmin);
adminRoutes.post('/assign-student', protect, assignStudent);
adminRoutes.put('/update-student-progress', protect, updateStudentProgress);
adminRoutes.post('/courses', protect, upload, createCourse);
adminRoutes.get('/courses', protect, getAllCourses);
adminRoutes.put('/courses/edit/:courseId', protect, upload, updateCourse);

adminRoutes.get('/donors', protect, getAllDonors);
// adminRoutes.get('/donations', protect, getAllDonations);
adminRoutes.get('/institutions', protect, getAllInstitutions);

adminRoutes.delete('/courses/delete/:courseId', protect, deleteCourse);
adminRoutes.post('/carousel', protect, uploadCarouselImages, createOrUpdateCarousel);

adminRoutes.post('/video-cards', protect, uploadVideoThumbnail, addVideoCard);
adminRoutes.put('/video-cards/:id', protect, uploadVideoThumbnail, updateVideoCard);
adminRoutes.delete('/video-cards/:id', protect, deleteVideoCard);

adminRoutes.post('/hero-section', protect, addHeroSection);
adminRoutes.put('/hero-section/:id', protect, updateHeroSection);
adminRoutes.delete('/hero-section/:id', protect, deleteHeroSection);

adminRoutes.post('/bullet-points', protect, addBulletPoint);
adminRoutes.put('/bullet-points/:id', protect, updateBulletPoint);
adminRoutes.delete('/bullet-points/:id', protect, deleteBulletPoint);

// adminRoutes.post('/testimonials', protect, addTestimonial);
// adminRoutes.put('/testimonials/:id', protect, updateTestimonial);
// adminRoutes.delete('/testimonials/:id', protect, deleteTestimonial);

// Sections Admin Routes
adminRoutes.post('/sections', protect, uploadSectionsImage, addSection);
adminRoutes.get('/sections', protect, getAllSections);
adminRoutes.get('/sections/:id', protect, getSectionById);
adminRoutes.put('/sections/:id', protect, uploadSectionsImage, updateSection);
adminRoutes.delete('/sections/:id', protect, deleteSection);

// Referred By Admin Routes
adminRoutes.post('/referred-by', protect, addReferredBy);
adminRoutes.get('/referred-by/:id', protect, getOneReferredBy);
adminRoutes.put('/referred-by/:id', protect, updateReferredBy);
adminRoutes.delete('/referred-by/:id', protect, deleteReferredBy);

adminRoutes.get('/db-backup', protect, downloadBackup);

adminRoutes.get('/home', protect, getHomepageContent);
// adminRoutes.get('/home', protect, getHomepageContent);

// V3 Dynamic Things

// Testimonials Routes -----------------------------------------------------

// CARD TESTIMONIALS
adminRoutes.get('/testimonials/cards', protect, getAllCardTestimonials);
adminRoutes.post('/testimonials/cards', protect, uploadTestimonialsImage, createCardTestimonial);
adminRoutes.put('/testimonials/cards/:id', protect, uploadTestimonialsImage, updateCardTestimonial);
adminRoutes.delete('/testimonials/cards/:id', protect, deleteCardTestimonial);

// CARD TESTIMONIALS
adminRoutes.get('/testimonials/videos', protect, getAllVideoTestimonials);
adminRoutes.post('/testimonials/videos', protect, createVideoTestimonial);
adminRoutes.put('/testimonials/videos/:id', protect, updateVideoTestimonial);
adminRoutes.delete('/testimonials/videos/:id', protect, deleteVideoTestimonial);

// Reorder
adminRoutes.put('/testimonials/reorder', protect, reorderTestimonials);

// FEATURED STORIES
adminRoutes.get('/testimonials/featured-stories', protect, getAllFeaturedStories);
adminRoutes.post('/testimonials/featured-stories', protect, createFeaturedStory);
adminRoutes.put('/testimonials/featured-stories/:id', protect, updateFeaturedStory);
adminRoutes.delete('/testimonials/featured-stories/:id', protect, deleteFeaturedStory);
// ----------------------------------------------------------------------------

// Leadership Routes -----------------------------------------------------

adminRoutes.get('/leadership', protect, getAllLeadership);
adminRoutes.get('/leadership/:id', protect, getLeadershipById);
adminRoutes.post('/leadership', protect, uploadLeadershipImageMiddleware, createLeadership);
adminRoutes.put('/leadership/:id', protect, uploadLeadershipImageMiddleware, updateLeadership);
adminRoutes.delete('/leadership/:id', protect, deleteLeadership);
adminRoutes.post('/leadership/reorder', protect, reorderLeadership);

// Leadership Page Routes -------------------------------------------------
adminRoutes.get('/leadership-page', protect, getLeadershipPageAdmin);
adminRoutes.post('/leadership-page', protect, createLeadershipPage);
adminRoutes.put('/leadership-page', protect, updateLeadershipPage);
adminRoutes.post('/leadership-page/upload-hero-image', protect, uploadLeadershipImageMiddleware, uploadLeadershipHeroImage);

// Gallery Routes -----------------------------------------------------
adminRoutes.get('/gallery', protect, getAllGalleryItems);
adminRoutes.put('/gallery/reorder', protect, reorderGalleryItems);
adminRoutes.get('/gallery/:id', protect, getGalleryItemById);
adminRoutes.post('/gallery', protect, uploadGalleryImage, createGalleryItem);
adminRoutes.put('/gallery/:id', protect, uploadGalleryImage, updateGalleryItem);
adminRoutes.delete('/gallery/:id', protect, deleteGalleryItem);
adminRoutes.put('/gallery/:id/toggle-status', protect, toggleGalleryItemStatus);

// Partner Institution Routes -----------------------------------------------------
adminRoutes.get('/partner-institution', protect, getAllPartnerInstitutions);
adminRoutes.put('/partner-institution/reorder', protect, reorderPartnerInstitutions);
adminRoutes.post('/partner-institution', protect, uploadPartnerInstitutionImages, createPartnerInstitution);
adminRoutes.put('/partner-institution/:id', protect, uploadPartnerInstitutionImages, updatePartnerInstitution);
adminRoutes.delete('/partner-institution/:id', protect, deletePartnerInstitution);

// Global Partners Routes -----------------------------------------------------
adminRoutes.get('/global-partners', protect, getAllGlobalPartners);
adminRoutes.post('/global-partners', protect, uploadPartnerInstitutionImages, createGlobalPartner);
adminRoutes.put('/global-partners/reorder', protect, reorderGlobalPartners);
adminRoutes.get('/global-partners/:id', protect, getGlobalPartnerById);
adminRoutes.put('/global-partners/:id', protect, uploadPartnerInstitutionImages, updateGlobalPartner);
adminRoutes.delete('/global-partners/:id', protect, deleteGlobalPartner);

// Career Page Routes -----------------------------------------------------
adminRoutes.get('/career-page', protect, getCareerPageAdmin);
adminRoutes.post('/career-page', protect, createCareerPage);
adminRoutes.put('/career-page', protect, updateCareerPage);
adminRoutes.put('/career-page/section/:section', protect, updateCareerPageSection);
adminRoutes.delete('/career-page', protect, deleteCareerPage);

// Career Page - Benefit management
adminRoutes.post('/career-page/benefit', protect, addCareerBenefit);
adminRoutes.put('/career-page/benefit/:benefitId', protect, updateCareerBenefit);
adminRoutes.delete('/career-page/benefit/:benefitId', protect, deleteCareerBenefit);

// Career Page - Job category management
adminRoutes.post('/career-page/job-category', protect, addCareerJobCategory);
adminRoutes.delete('/career-page/job-category/:category', protect, deleteCareerJobCategory);

// Introduction Page Routes -----------------------------------------------------
adminRoutes.get('/introduction-page', protect, getIntroductionPageAdmin);
adminRoutes.post('/introduction-page', protect, createIntroductionPage);
adminRoutes.put('/introduction-page', protect, updateIntroductionPage);
adminRoutes.delete('/introduction-page', protect, deleteIntroductionPage);

// Elementary Middle School Page Routes -----------------------------------------------------
adminRoutes.get('/elementary-middle-school-page', protect, getElementaryMiddleSchoolPageAdmin);
adminRoutes.post('/elementary-middle-school-page', protect, createElementaryMiddleSchoolPage);
adminRoutes.put('/elementary-middle-school-page', protect, updateElementaryMiddleSchoolPage);
adminRoutes.post('/elementary-middle-school-page/reorder', protect, reorderElementaryMiddleSchoolItems);
adminRoutes.post('/elementary-middle-school-page/upload-hero-image', protect, uploadElementaryMiddleSchoolHeroImageMiddleware, uploadElementaryMiddleSchoolHeroImage);
adminRoutes.post('/elementary-middle-school-page/upload-reach-image', protect, uploadElementaryMiddleSchoolReachImageMiddleware, uploadElementaryMiddleSchoolReachImage);
adminRoutes.post('/elementary-middle-school-page/upload-mode-image', protect, uploadElementaryMiddleSchoolModeImageMiddleware, uploadElementaryMiddleSchoolModeImage);
adminRoutes.delete('/elementary-middle-school-page', protect, deleteElementaryMiddleSchoolPage);

// Slum Children Page Routes -----------------------------------------------------
adminRoutes.get('/slum-children-page', protect, getSlumChildrenPageAdmin);
adminRoutes.post('/slum-children-page', protect, createSlumChildrenPage);
adminRoutes.put('/slum-children-page', protect, updateSlumChildrenPage);
adminRoutes.post('/slum-children-page/reorder', protect, reorderSlumChildrenItems);
adminRoutes.post('/slum-children-page/upload-hero-image', protect, uploadSlumChildrenHeroImageMiddleware, uploadSlumChildrenHeroImage);
adminRoutes.delete('/slum-children-page', protect, deleteSlumChildrenPage);

// Public Government School Page Routes -----------------------------------------------------
adminRoutes.get('/public-government-school-page', protect, getPublicGovernmentSchoolPageAdmin);
adminRoutes.post('/public-government-school-page', protect, createPublicGovernmentSchoolPage);
adminRoutes.put('/public-government-school-page', protect, updatePublicGovernmentSchoolPage);
adminRoutes.post('/public-government-school-page/reorder', protect, reorderPublicGovernmentSchoolItems);
adminRoutes.post('/public-government-school-page/upload-hero-image', protect, uploadPublicGovernmentSchoolHeroImageMiddleware, uploadPublicGovernmentSchoolHeroImage);
adminRoutes.post('/public-government-school-page/upload-blended-image', protect, uploadPublicGovernmentSchoolBlendedImageMiddleware, uploadPublicGovernmentSchoolBlendedImage);
adminRoutes.post('/public-government-school-page/upload-case-study-image', protect, uploadPublicGovernmentSchoolCaseStudyImageMiddleware, uploadPublicGovernmentSchoolCaseStudyImage);
adminRoutes.post('/public-government-school-page/upload-case-study-pdf', protect, uploadPublicGovernmentSchoolCaseStudyPDFMiddleware, uploadPublicGovernmentSchoolCaseStudyPDF);
adminRoutes.delete('/public-government-school-page', protect, deletePublicGovernmentSchoolPage);

// Out Of School / Dropout Page Routes -----------------------------------------------------
adminRoutes.get('/out-of-school-dropout-page', protect, getOutOfSchoolDropoutPageAdmin);
adminRoutes.post('/out-of-school-dropout-page', protect, createOutOfSchoolDropoutPage);
adminRoutes.put('/out-of-school-dropout-page', protect, updateOutOfSchoolDropoutPage);
adminRoutes.post('/out-of-school-dropout-page/reorder', protect, reorderOutOfSchoolDropoutItems);
adminRoutes.post('/out-of-school-dropout-page/upload-hero-image', protect, uploadOutOfSchoolDropoutHeroImageMiddleware, uploadOutOfSchoolDropoutHeroImage);
adminRoutes.post('/out-of-school-dropout-page/upload-featured-image', protect, uploadOutOfSchoolDropoutFeaturedImageMiddleware, uploadOutOfSchoolDropoutFeaturedImage);
adminRoutes.post('/out-of-school-dropout-page/upload-second-image', protect, uploadOutOfSchoolDropoutSecondImageMiddleware, uploadOutOfSchoolDropoutSecondImage);
adminRoutes.post('/out-of-school-dropout-page/upload-gallery-image', protect, uploadOutOfSchoolDropoutGalleryImageMiddleware, uploadOutOfSchoolDropoutGalleryImage);

// Madrasa Page Routes -----------------------------------------------------
adminRoutes.get('/madrasa-page', protect, getMadrasaPageAdmin);
adminRoutes.post('/madrasa-page', protect, createMadrasaPage);
adminRoutes.put('/madrasa-page', protect, updateMadrasaPage);
adminRoutes.post('/madrasa-page/reorder', protect, reorderMadrasaItems);
adminRoutes.post('/madrasa-page/upload-hero-image', protect, uploadMadrasaHeroImageMiddleware, uploadMadrasaHeroImage);
adminRoutes.post('/madrasa-page/upload-image1', protect, uploadMadrasaImage1Middleware, uploadMadrasaImage1);
adminRoutes.post('/madrasa-page/upload-image2', protect, uploadMadrasaImage2Middleware, uploadMadrasaImage2);

// Teachers Training Page Routes -----------------------------------------------------
adminRoutes.get('/teachers-training-page', protect, getTeachersTrainingPageAdmin);
adminRoutes.post('/teachers-training-page', protect, createTeachersTrainingPage);
adminRoutes.put('/teachers-training-page', protect, updateTeachersTrainingPage);
adminRoutes.post('/teachers-training-page/reorder', protect, reorderTeachersTrainingItems);
adminRoutes.post('/teachers-training-page/upload-hero-image', protect, uploadTeachersTrainingHeroImageMiddleware, uploadTeachersTrainingHeroImage);
adminRoutes.post('/teachers-training-page/upload-image-section', protect, uploadTeachersTrainingImageSectionMiddleware, uploadTeachersTrainingImageSection);

// Be A Partner Page Routes -----------------------------------------------------
adminRoutes.get('/be-a-partner-page', protect, getBeAPartnerPageAdmin);
adminRoutes.post('/be-a-partner-page', protect, createBeAPartnerPage);
adminRoutes.put('/be-a-partner-page', protect, updateBeAPartnerPage);
adminRoutes.post('/be-a-partner-page/reorder', protect, reorderBeAPartnerItems);
adminRoutes.post('/be-a-partner-page/upload-header-image', protect, uploadBeAPartnerHeaderImage, uploadBeAPartnerHeaderImageCtrl);

// Girls Education Page Routes -----------------------------------------------------
adminRoutes.get('/girls-education-page', protect, getGirlsEducationPageAdmin);
adminRoutes.post('/girls-education-page', protect, createGirlsEducationPage);
adminRoutes.put('/girls-education-page', protect, updateGirlsEducationPage);
adminRoutes.post('/girls-education-page/reorder', protect, reorderGirlsEducationItems);
adminRoutes.post('/girls-education-page/upload-hero-image', protect, uploadGirlsEducationHeroImageMiddleware, uploadGirlsEducationHeroImage);
adminRoutes.post('/girls-education-page/upload-impact-image', protect, uploadGirlsEducationImpactImageMiddleware, uploadGirlsEducationImpactImage);
adminRoutes.delete('/girls-education-page', protect, deleteGirlsEducationPage);

// Global Education Page Routes -----------------------------------------------------
adminRoutes.get('/global-education-page', protect, getGlobalEducationPageAdmin);
adminRoutes.post('/global-education-page', protect, createGlobalEducationPage);
adminRoutes.put('/global-education-page', protect, updateGlobalEducationPage);
adminRoutes.post('/global-education-page/reorder', protect, reorderGlobalEducationItems);
adminRoutes.post('/global-education-page/upload-mission-image', protect, uploadGlobalEducationMissionImageMiddleware, uploadGlobalEducationMissionImage);
adminRoutes.post('/global-education-page/upload-equity-image', protect, uploadGlobalEducationEquityImageMiddleware, uploadGlobalEducationEquityImage);
adminRoutes.post('/global-education-page/upload-banner-image', protect, uploadGlobalEducationBannerImageMiddleware, uploadGlobalEducationBannerImage);
adminRoutes.post('/global-education-page/upload-hero-image', protect, uploadGlobalEducationHeroImageMiddleware, uploadGlobalEducationHeroImage);
adminRoutes.delete('/global-education-page', protect, deleteGlobalEducationPage);

// Privacy Policy Page Routes -----------------------------------------------------
adminRoutes.get('/privacy-policy-page', protect, getPrivacyPolicyPageAdmin);
adminRoutes.post('/privacy-policy-page', protect, createPrivacyPolicyPage);
adminRoutes.put('/privacy-policy-page', protect, updatePrivacyPolicyPage);
adminRoutes.post('/privacy-policy-page/reorder', protect, reorderPrivacyPolicyItems);
adminRoutes.post('/privacy-policy-page/upload-hero-image', protect, uploadPrivacyPolicyHeroImageMiddleware, uploadPrivacyPolicyHeroImage);
adminRoutes.delete('/privacy-policy-page', protect, deletePrivacyPolicyPage);

// Adult Education Page Routes -----------------------------------------------------
adminRoutes.get('/adult-education-page', protect, getAdultEducationPageAdmin);
adminRoutes.post('/adult-education-page', protect, createAdultEducationPage);
adminRoutes.put('/adult-education-page', protect, updateAdultEducationPage);
adminRoutes.post('/adult-education-page/reorder', protect, reorderAdultEducationItems);
adminRoutes.post('/adult-education-page/upload-hero-image', protect, uploadAdultEducationHeroImageMiddleware, uploadAdultEducationHeroImage);
adminRoutes.post('/adult-education-page/upload-why-image', protect, uploadAdultEducationWhyImageMiddleware, uploadAdultEducationWhyImage);
adminRoutes.delete('/adult-education-page', protect, deleteAdultEducationPage);

// NEI USA Introduction Page Routes -----------------------------------------------------
adminRoutes.get('/nei-usa-introduction-page', protect, getNeiUsaIntroductionPageAdmin);
adminRoutes.post('/nei-usa-introduction-page', protect, createNeiUsaIntroductionPage);
adminRoutes.put('/nei-usa-introduction-page', protect, updateNeiUsaIntroductionPage);
adminRoutes.post('/nei-usa-introduction-page/reorder', protect, reorderNeiUsaIntroductionItems);
adminRoutes.post('/nei-usa-introduction-page/upload-about-image', protect, uploadNeiUsaIntroductionAboutImageMiddleware, uploadNeiUsaIntroductionAboutImage);
adminRoutes.post('/nei-usa-introduction-page/upload-who-we-serve-image', protect, uploadNeiUsaIntroductionWhoWeServeImageMiddleware, uploadNeiUsaIntroductionWhoWeServeImage);
adminRoutes.post('/nei-usa-introduction-page/upload-what-we-offer-image', protect, uploadNeiUsaIntroductionWhatWeOfferImageMiddleware, uploadNeiUsaIntroductionWhatWeOfferImage);
adminRoutes.delete('/nei-usa-introduction-page', protect, deleteNeiUsaIntroductionPage);

// Soft Skill Training Page Routes -----------------------------------------------------
adminRoutes.get('/soft-skill-training-page', protect, getSoftSkillTrainingPageAdmin);
adminRoutes.post('/soft-skill-training-page', protect, createSoftSkillTrainingPage);
adminRoutes.put('/soft-skill-training-page', protect, updateSoftSkillTrainingPage);
adminRoutes.post('/soft-skill-training-page/reorder', protect, reorderSoftSkillTrainingItems);
adminRoutes.post('/soft-skill-training-page/upload-hero-image', protect, uploadSoftSkillTrainingHeroImageMiddleware, uploadSoftSkillTrainingHeroImage);
adminRoutes.delete('/soft-skill-training-page', protect, deleteSoftSkillTrainingPage);

// Technical Skill Training Page Routes -----------------------------------------------------
adminRoutes.get('/technical-skill-training-page', protect, getTechnicalSkillTrainingPageAdmin);
adminRoutes.post('/technical-skill-training-page', protect, createTechnicalSkillTrainingPage);
adminRoutes.put('/technical-skill-training-page', protect, updateTechnicalSkillTrainingPage);
adminRoutes.post('/technical-skill-training-page/reorder', protect, reorderTechnicalSkillTrainingItems);
adminRoutes.post('/technical-skill-training-page/upload-hero-image', protect, uploadTechnicalSkillTrainingHeroImageMiddleware, uploadTechnicalSkillTrainingHeroImage);
adminRoutes.post('/technical-skill-training-page/learning-mode/:itemId/upload-image', protect, uploadTechnicalSkillTrainingModeImageMiddleware, uploadTechnicalSkillTrainingModeImage);
adminRoutes.delete('/technical-skill-training-page', protect, deleteTechnicalSkillTrainingPage);

// Remote Learning Page Routes -----------------------------------------------------
adminRoutes.get('/remote-learning-page', protect, getRemoteLearningPageAdmin);
adminRoutes.post('/remote-learning-page', protect, createRemoteLearningPage);
adminRoutes.put('/remote-learning-page', protect, updateRemoteLearningPage);
adminRoutes.delete('/remote-learning-page', protect, deleteRemoteLearningPage);
adminRoutes.post('/remote-learning-page/upload-header-image', protect, uploadRemoteLearningHeaderImageMiddleware, uploadRemoteLearningHeaderImage);

// Blended Learning Page Routes -----------------------------------------------------
adminRoutes.get('/blended-learning-page', protect, getBlendedLearningPageAdmin);
adminRoutes.post('/blended-learning-page', protect, createBlendedLearningPage);
adminRoutes.put('/blended-learning-page', protect, updateBlendedLearningPage);
adminRoutes.delete('/blended-learning-page', protect, deleteBlendedLearningPage);
adminRoutes.post('/blended-learning-page/upload-header-image', protect, uploadBlendedLearningHeaderImageMiddleware, uploadBlendedLearningHeaderImageCtrl);
adminRoutes.post('/blended-learning-page/upload-supporting-image', protect, uploadBlendedLearningSupportingImage, uploadSupportingImage);

// Discourse Oriented Pedagogy Page Routes -----------------------------------------------------
adminRoutes.get('/discourse-oriented-pedagogy-page', protect, getAdminDOPPage);
adminRoutes.post('/discourse-oriented-pedagogy-page', protect, createOrUpdateDOPPage);
adminRoutes.put('/discourse-oriented-pedagogy-page', protect, updateDOPPage);
adminRoutes.post('/discourse-oriented-pedagogy-page/upload-hero-image', protect, uploadDOPHeroImage, uploadDOPHeroImageCtrl);
adminRoutes.post('/discourse-oriented-pedagogy-page/upload-introduction-image', protect, uploadDOPIntroductionImage, uploadDOPIntroductionImageCtrl);
adminRoutes.post('/discourse-oriented-pedagogy-page/upload-founder-image', protect, uploadDOPFounderImage, uploadDOPFounderImageCtrl);
adminRoutes.post('/discourse-oriented-pedagogy-page/upload-feature-image', protect, uploadDOPFeatureImage, uploadDOPFeatureImageCtrl);

// Application of Technology Page Routes -----------------------------------------------------
adminRoutes.get('/application-of-technology-page', protect, getAdminApplicationOfTechnologyPage);
adminRoutes.post('/application-of-technology-page', protect, createOrUpdateApplicationOfTechnologyPage);
adminRoutes.put('/application-of-technology-page', protect, updateApplicationOfTechnologyPage);
adminRoutes.post('/application-of-technology-page/upload-hero-image', protect, uploadAppTechHeroImage, uploadAppTechHeroImageCtrl);
adminRoutes.post('/application-of-technology-page/upload-digital-classroom-image', protect, uploadAppTechDigitalClassroomImage, uploadAppTechDigitalClassroomImageCtrl);
adminRoutes.post('/application-of-technology-page/upload-onboarding-image', protect, uploadAppTechOnboardingImage, uploadAppTechOnboardingImageCtrl);
adminRoutes.post('/application-of-technology-page/upload-ai-image', protect, uploadAppTechAIImage, uploadAppTechAIImageCtrl);

// Reports & Financials Page Routes -----------------------------------------------------
adminRoutes.get('/reports-financials-page', protect, getAdminReportsFinancialsPage);
adminRoutes.post('/reports-financials-page', protect, createOrUpdateReportsFinancialsPage);
adminRoutes.put('/reports-financials-page', protect, updateReportsFinancialsPage);
adminRoutes.post('/reports-financials-page/upload-hero-image', protect, uploadReportsFinancialsHeroImage, uploadReportsFinancialsHeroImageCtrl);
adminRoutes.post('/reports-financials-page/upload-impact-pdf', protect, uploadImpactReportPDF, uploadImpactReportPDFCtrl);

// Homepage Management Routes -----------------------------------------------------
adminRoutes.get('/homepage', protect, getHomePageForAdmin);
adminRoutes.post('/homepage', protect, createOrUpdateHomePage);
adminRoutes.put('/homepage', protect, createOrUpdateHomePage);

// Homepage Section Management
// Banner Slides - Upload images
adminRoutes.post(
  '/homepage/banner/upload',
  protect,
  uploadHomepageBannerSlides,
  uploadBannerSlides
);
adminRoutes.put('/homepage/banner', protect, updateBannerSection);

// Our Mission - Upload image
adminRoutes.post(
  '/homepage/our-mission/upload-image',
  protect,
  uploadHomepageOurMissionImage,
  uploadOurMissionImage
);
adminRoutes.put('/homepage/our-mission', protect, updateOurMissionSection);

// Leadership - Upload image (under Our Mission)
adminRoutes.post(
  '/homepage/our-mission/leadership/upload-image',
  protect,
  uploadHomepageLeadershipImage,
  uploadLeadershipImage
);

// Innovation - Upload image
adminRoutes.post(
  '/homepage/innovation-section/upload-image',
  protect,
  uploadHomepageInnovationImage,
  uploadInnovationImage
);
adminRoutes.put('/homepage/innovation-section', protect, updateInnovationSection);

// Global Programs - Upload image
adminRoutes.post(
  '/homepage/global-programs/upload-image',
  protect,
  uploadHomepageGlobalProgramsImage,
  uploadGlobalProgramsImage
);
adminRoutes.put('/homepage/global-programs', protect, updateGlobalProgramsSection);

// Statistics
adminRoutes.put('/homepage/statistics', protect, updateStatisticsSection);
adminRoutes.post(
  '/homepage/statistics/background-image',
  protect,
  uploadHomeStatisticsBackgroundImageMiddleware,
  uploadStatisticsBackgroundImage
);

// Testimonials - Upload image
adminRoutes.post(
  '/homepage/testimonials/upload-image',
  protect,
  uploadHomepageTestimonialImage,
  uploadTestimonialImage
);
adminRoutes.put('/homepage/testimonials', protect, updateTestimonialsSection);

// Social Media Embeds (Admin)
adminRoutes.get('/social-embeds', protect, getSocialEmbeds);
adminRoutes.post('/social-embeds', protect, createSocialEmbed);
adminRoutes.put('/social-embeds/:id', protect, updateSocialEmbed);
adminRoutes.patch('/social-embeds/:id/status', protect, toggleSocialEmbedStatus);
adminRoutes.delete('/social-embeds/:id', protect, deleteSocialEmbed);
adminRoutes.delete('/homepage', protect, deleteHomePage);

// Contact Information Routes -----------------------------------------------------
adminRoutes.get('/contact', protect, getContactInfoAdmin);
adminRoutes.put('/contact', protect, updateContactInfo);

// Contact Inquiries Management Routes -----------------------------------------------------
adminRoutes.get('/contact-inquiries', protect, getAllContactInquiries);
adminRoutes.get('/contact-inquiries/stats', protect, getContactInquiryStats);
adminRoutes.get('/contact-inquiries/:id', protect, getContactInquiryById);
adminRoutes.put('/contact-inquiries/:id', protect, updateContactInquiry);
adminRoutes.delete('/contact-inquiries/:id', protect, deleteContactInquiry);
adminRoutes.delete('/contact-inquiries/bulk', protect, deleteMultipleContactInquiries);

// Subscribe Email Management Routes -----------------------------------------------------
adminRoutes.get('/subscribe', protect, getAllSubscribes);
adminRoutes.get('/subscribe/:id', protect, getSubscribeById);
adminRoutes.put('/subscribe/:id', protect, updateSubscribe);
adminRoutes.delete('/subscribe/:id', protect, deleteSubscribe);
adminRoutes.delete('/subscribe/bulk', protect, deleteMultipleSubscribes);

// Volunteer Management Routes -----------------------------------------------------
// Test route to verify routes are loaded
adminRoutes.get('/volunteers/test', (req, res) => {
  res.json({ success: true, message: 'Volunteer routes are working!' });
});

adminRoutes.get('/volunteers', protect, getAllVolunteersAdmin);
adminRoutes.get('/volunteers/stats', protect, getVolunteerStats);
adminRoutes.get('/volunteers/:id', protect, getVolunteerById);
adminRoutes.delete('/volunteers/:id', protect, deleteVolunteer);
adminRoutes.delete('/volunteers/bulk', protect, deleteMultipleVolunteers);

export default adminRoutes;
