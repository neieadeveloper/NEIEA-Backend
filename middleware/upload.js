import multer from 'multer';
import multerS3 from 'multer-s3';
import { S3Client } from '@aws-sdk/client-s3';
import path from 'path';

const s3 = new S3Client({
  region: process.env.AWSS_REGION,
  credentials: {
    accessKeyId: process.env.AWSS_OPEN_KEY,
    secretAccessKey: process.env.AWSS_SEC_KEY,
  },
});

function checkFileType(file, cb) {
  const filetypes = /jpeg|jpg|png|webp|gif/;
  const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
  const mimetype = filetypes.test(file.mimetype);
  if (mimetype && extname) {
    return cb(null, true);
  } else {
    cb('Error: Images Only!');
  }
}

const upload = multer({
  storage: multerS3({
    s3: s3,
    bucket: process.env.AWSS_BUCKET_NAME,
    // acl: 'public-read',
    contentType: multerS3.AUTO_CONTENT_TYPE,
    key: function (req, file, cb) {
      cb(null, `courses/${Date.now().toString()}-${file.originalname}`);
    },
  }),
  limits: { fileSize: 1000000 }, // 1MB limit
  fileFilter: function (req, file, cb) {
    checkFileType(file, cb);
  },
}).single('image');

const uploadVideoThumbnail = multer({
  storage: multerS3({
    s3: s3,
    bucket: process.env.AWSS_BUCKET_NAME,
    // acl: 'public-read',
    contentType: multerS3.AUTO_CONTENT_TYPE,
    key: function (req, file, cb) {
      cb(null, `videoThumbnail/${Date.now().toString()}-${file.originalname}`);
    },
  }),
  limits: { fileSize: 1000000 }, // 1MB limit
  fileFilter: function (req, file, cb) {
    checkFileType(file, cb);
  },
}).single('thumbnail');

// Simple file type validation
function checkFileTypeForuploadInstitutionFiles(file, cb) {
  // Define allowed file types
  const allowedStudentListTypes = ['application/vnd.openxmlformats-officedocument.spreadsheetml.sheet', 'application/vnd.ms-excel', 'image/jpeg', 'image/png'];
  const allowedLogoTypes = ['image/jpeg', 'image/png'];

  // Check file type based on fieldname
  if (file.fieldname === 'studentList' && allowedStudentListTypes.includes(file.mimetype)) {
    cb(null, true);
  } else if (file.fieldname === 'institutionLogo' && allowedLogoTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error('Invalid file type!'));
  }
}

const uploadInstitutionFiles = multer({
  storage: multerS3({
    s3: s3,
    bucket: process.env.AWSS_BUCKET_NAME,
    contentType: multerS3.AUTO_CONTENT_TYPE,
    key: function (req, file, cb) {
      const filePath = `institutions/${Date.now().toString()}-${file.originalname}`;
      cb(null, filePath);
    },
  }),
  limits: {
    fileSize: function (req, file, cb) {
      // Set file size limits based on the field
      const maxSize = file.fieldname === 'studentList' ? 10 * 1024 * 1024 : 100 * 1024 * 1024;
      cb(null, true, maxSize);
    },
  },
  fileFilter: function (req, file, cb) {
    checkFileTypeForuploadInstitutionFiles(file, cb);
  },
}).fields([
  { name: 'studentList', maxCount: 1 },
  { name: 'institutionLogo', maxCount: 1 }
]);

const uploadCarouselImages = multer({
  storage: multerS3({
    s3: s3,
    bucket: process.env.AWSS_BUCKET_NAME,
    // acl: 'public-read',
    contentType: multerS3.AUTO_CONTENT_TYPE,
    key: function (req, file, cb) {
      cb(null, `carousel/${Date.now().toString()}-${file.originalname}`);
    },
  }),
  limits: { fileSize: 1000000 }, // 1MB limit
  fileFilter: function (req, file, cb) {
    checkFileType(file, cb);
  },
}).array('images', 3); // Allow up to 3 images

const uploadSectionsImage = multer({
  storage: multerS3({
    s3: s3,
    bucket: process.env.AWSS_BUCKET_NAME,
    // acl: 'public-read',
    contentType: multerS3.AUTO_CONTENT_TYPE,
    key: function (req, file, cb) {
      cb(null, `sections/${Date.now().toString()}-${file.originalname}`);
    },
  }),
  limits: { fileSize: 1000000 }, // 1MB limit
  fileFilter: function (req, file, cb) {
    checkFileType(file, cb);
  },
}).single('image');

const uploadTestimonialsImage = multer({
  storage: multerS3({
    s3: s3,
    bucket: process.env.AWSS_BUCKET_NAME,
    // acl: 'public-read',
    contentType: multerS3.AUTO_CONTENT_TYPE,
    key: function (req, file, cb) {
      cb(null, `testimonials/${Date.now().toString()}-${file.originalname}`);
    },
  }),
  limits: { fileSize: 2000000 }, // 2MB limit
  fileFilter: function (req, file, cb) {
    checkFileType(file, cb);
  },
}).single('image');

const uploadNewsImage = multer({
  storage: multerS3({
    s3: s3,
    bucket: process.env.AWSS_BUCKET_NAME,
    contentType: multerS3.AUTO_CONTENT_TYPE,
    key: function (req, file, cb) {
      cb(null, `news/${Date.now().toString()}-${file.originalname}`);
    },
  }),
  limits: { fileSize: 2000000 }, // 2MB limit
  fileFilter: function (req, file, cb) {
    checkFileType(file, cb);
  },
}).single('image');


const uploadHomeStatisticsBackgroundImage = multer({
  storage: multerS3({
    s3: s3,
    bucket: process.env.AWSS_BUCKET_NAME,
    contentType: multerS3.AUTO_CONTENT_TYPE,
    key: function (req, file, cb) {
      cb(null, `homepage/statistics/${Date.now().toString()}-${file.originalname}`);
    },
  }),
  limits: { fileSize: 3000000 },
  fileFilter: function (req, file, cb) {
    checkFileType(file, cb);
  },
}).single('image');

const uploadLeadershipImage = multer({
  storage: multerS3({
    s3: s3,
    bucket: process.env.AWSS_BUCKET_NAME,
    // acl: 'public-read',
    contentType: multerS3.AUTO_CONTENT_TYPE,
    key: function (req, file, cb) {
      cb(null, `leadership/${Date.now().toString()}-${file.originalname}`);
    },
  }),
  limits: { fileSize: 2000000 }, // 2MB limit
  fileFilter: function (req, file, cb) {
    checkFileType(file, cb);
  },
}).single('image');

const uploadGalleryImage = multer({
  storage: multerS3({
    s3: s3,
    bucket: process.env.AWSS_BUCKET_NAME,
    // acl: 'public-read',
    contentType: multerS3.AUTO_CONTENT_TYPE,
    key: function (req, file, cb) {
      cb(null, `gallery/${Date.now().toString()}-${file.originalname}`);
    },
  }),
  limits: { fileSize: 2000000 }, // 2MB limit
  fileFilter: function (req, file, cb) {
    checkFileType(file, cb);
  },
}).single('image');

// Partner Institution Featured Image Upload (Card Image)
const uploadPartnerInstitutionFeaturedImage = multer({
  storage: multerS3({
    s3: s3,
    bucket: process.env.AWSS_BUCKET_NAME,
    contentType: multerS3.AUTO_CONTENT_TYPE,
    key: function (req, file, cb) {
      cb(null, `partner-institutions/${Date.now().toString()}-${file.originalname}`);
    },
  }),
  limits: { fileSize: 2000000 }, // 2MB limit
  fileFilter: function (req, file, cb) {
    checkFileType(file, cb);
  },
}).single('featuredImage');

// Partner Institution Detail Images Upload (Multiple)
const uploadPartnerInstitutionDetailImages = multer({
  storage: multerS3({
    s3: s3,
    bucket: process.env.AWSS_BUCKET_NAME,
    contentType: multerS3.AUTO_CONTENT_TYPE,
    key: function (req, file, cb) {
      cb(null, `partner-institutions/details/${Date.now().toString()}-${file.originalname}`);
    },
  }),
  limits: { fileSize: 2000000 }, // 2MB limit per image
  fileFilter: function (req, file, cb) {
    checkFileType(file, cb);
  },
}).array('detailImages', 10); // Maximum 10 images

// Combined upload for Partner Institutions (Featured + Details)
const uploadPartnerInstitutionImages = multer({
  storage: multerS3({
    s3: s3,
    bucket: process.env.AWSS_BUCKET_NAME,
    contentType: multerS3.AUTO_CONTENT_TYPE,
    key: function (req, file, cb) {
      const folder = file.fieldname === 'featuredImage' ? 'partner-institutions' : 'partner-institutions/details';
      cb(null, `${folder}/${Date.now().toString()}-${file.originalname}`);
    },
  }),
  limits: {
    fileSize: 2000000, // 2MB per file
    files: 11, // Max 11 files total (1 featured + 10 details)
    fieldSize: 10 * 1024 * 1024, // 10MB for non-file fields
    // Note: This won't help with Vercel's 4.5MB limit
  },
  fileFilter: function (req, file, cb) {
    checkFileType(file, cb);
  },
}).fields([
  { name: 'featuredImage', maxCount: 1 },
  { name: 'detailImages', maxCount: 10 }
]);

// Partnering Institution Page Image Upload
const uploadPartneringInstitutionPageImage = multer({
  storage: multerS3({
    s3: s3,
    bucket: process.env.AWSS_BUCKET_NAME,
    contentType: multerS3.AUTO_CONTENT_TYPE,
    key: function (req, file, cb) {
      cb(null, `partnering-institution-page/${Date.now().toString()}-${file.originalname}`);
    },
  }),
  limits: { fileSize: 2000000 }, // 2MB limit
  fileFilter: function (req, file, cb) {
    checkFileType(file, cb);
  },
}).single('headerImage');

// Remote Learning Page Header Image Upload
const uploadRemoteLearningHeaderImage = multer({
  storage: multerS3({
    s3: s3,
    bucket: process.env.AWSS_BUCKET_NAME,
    contentType: multerS3.AUTO_CONTENT_TYPE,
    key: function (req, file, cb) {
      cb(null, `remote-learning/${Date.now().toString()}-${file.originalname}`);
    },
  }),
  limits: { fileSize: 2000000 }, // 2MB limit
  fileFilter: function (req, file, cb) {
    checkFileType(file, cb);
  },
}).single('headerImage');

// Blended Learning Page Header Image Upload
const uploadBlendedLearningHeaderImage = multer({
  storage: multerS3({
    s3: s3,
    bucket: process.env.AWSS_BUCKET_NAME,
    contentType: multerS3.AUTO_CONTENT_TYPE,
    key: function (req, file, cb) {
      cb(null, `blended-learning/${Date.now().toString()}-${file.originalname}`);
    },
  }),
  limits: { fileSize: 2000000 }, // 2MB limit
  fileFilter: function (req, file, cb) {
    checkFileType(file, cb);
  },
}).single('headerImage');

// Blended Learning Page Supporting Image Upload
const uploadBlendedLearningSupportingImage = multer({
  storage: multerS3({
    s3: s3,
    bucket: process.env.AWSS_BUCKET_NAME,
    contentType: multerS3.AUTO_CONTENT_TYPE,
    key: function (req, file, cb) {
      cb(null, `blended-learning/${Date.now().toString()}-${file.originalname}`);
    },
  }),
  limits: { fileSize: 2000000 }, // 2MB limit
  fileFilter: function (req, file, cb) {
    checkFileType(file, cb);
  },
}).single('supportingImage');

// DOP Hero Image Upload
const uploadDOPHeroImage = multer({
  storage: multerS3({
    s3: s3,
    bucket: process.env.AWSS_BUCKET_NAME,
    contentType: multerS3.AUTO_CONTENT_TYPE,
    key: function (req, file, cb) {
      cb(null, `discourse-oriented-pedagogy/${Date.now().toString()}-${file.originalname}`);
    },
  }),
  limits: { fileSize: 2000000 }, // 2MB limit
  fileFilter: function (req, file, cb) {
    checkFileType(file, cb);
  },
}).single('heroImage');

// DOP Introduction Image Upload
const uploadDOPIntroductionImage = multer({
  storage: multerS3({
    s3: s3,
    bucket: process.env.AWSS_BUCKET_NAME,
    contentType: multerS3.AUTO_CONTENT_TYPE,
    key: function (req, file, cb) {
      cb(null, `discourse-oriented-pedagogy/${Date.now().toString()}-${file.originalname}`);
    },
  }),
  limits: { fileSize: 2000000 }, // 2MB limit
  fileFilter: function (req, file, cb) {
    checkFileType(file, cb);
  },
}).single('introductionImage');

// DOP Founder Image Upload
const uploadDOPFounderImage = multer({
  storage: multerS3({
    s3: s3,
    bucket: process.env.AWSS_BUCKET_NAME,
    contentType: multerS3.AUTO_CONTENT_TYPE,
    key: function (req, file, cb) {
      cb(null, `discourse-oriented-pedagogy/${Date.now().toString()}-${file.originalname}`);
    },
  }),
  limits: { fileSize: 2000000 }, // 2MB limit
  fileFilter: function (req, file, cb) {
    checkFileType(file, cb);
  },
}).single('founderImage');

// DOP Feature Image Upload
const uploadDOPFeatureImage = multer({
  storage: multerS3({
    s3: s3,
    bucket: process.env.AWSS_BUCKET_NAME,
    contentType: multerS3.AUTO_CONTENT_TYPE,
    key: function (req, file, cb) {
      cb(null, `discourse-oriented-pedagogy/${Date.now().toString()}-${file.originalname}`);
    },
  }),
  limits: { fileSize: 2000000 }, // 2MB limit
  fileFilter: function (req, file, cb) {
    checkFileType(file, cb);
  },
}).single('featureImage');

// Application of Technology Hero Image Upload
const uploadAppTechHeroImage = multer({
  storage: multerS3({
    s3: s3,
    bucket: process.env.AWSS_BUCKET_NAME,
    contentType: multerS3.AUTO_CONTENT_TYPE,
    key: function (req, file, cb) {
      cb(null, `application-of-technology/${Date.now().toString()}-${file.originalname}`);
    },
  }),
  limits: { fileSize: 2000000 }, // 2MB limit
  fileFilter: function (req, file, cb) {
    checkFileType(file, cb);
  },
}).single('heroImage');

// Application of Technology Digital Classroom Image Upload
const uploadAppTechDigitalClassroomImage = multer({
  storage: multerS3({
    s3: s3,
    bucket: process.env.AWSS_BUCKET_NAME,
    contentType: multerS3.AUTO_CONTENT_TYPE,
    key: function (req, file, cb) {
      cb(null, `application-of-technology/${Date.now().toString()}-${file.originalname}`);
    },
  }),
  limits: { fileSize: 2000000 }, // 2MB limit
  fileFilter: function (req, file, cb) {
    checkFileType(file, cb);
  },
}).single('digitalClassroomImage');

// Application of Technology Onboarding Image Upload
const uploadAppTechOnboardingImage = multer({
  storage: multerS3({
    s3: s3,
    bucket: process.env.AWSS_BUCKET_NAME,
    contentType: multerS3.AUTO_CONTENT_TYPE,
    key: function (req, file, cb) {
      cb(null, `application-of-technology/${Date.now().toString()}-${file.originalname}`);
    },
  }),
  limits: { fileSize: 2000000 }, // 2MB limit
  fileFilter: function (req, file, cb) {
    checkFileType(file, cb);
  },
}).single('onboardingImage');

// Application of Technology AI Image Upload
const uploadAppTechAIImage = multer({
  storage: multerS3({
    s3: s3,
    bucket: process.env.AWSS_BUCKET_NAME,
    contentType: multerS3.AUTO_CONTENT_TYPE,
    key: function (req, file, cb) {
      cb(null, `application-of-technology/${Date.now().toString()}-${file.originalname}`);
    },
  }),
  limits: { fileSize: 2000000 }, // 2MB limit
  fileFilter: function (req, file, cb) {
    checkFileType(file, cb);
  },
}).single('aiImage');

// ==================== Reports & Financials Page Uploads ====================

// PDF file type validation
function checkPDFFileType(file, cb) {
  const filetypes = /pdf/;
  const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
  const mimetype = file.mimetype === 'application/pdf';
  if (mimetype && extname) {
    return cb(null, true);
  } else {
    cb('Error: PDF Files Only!');
  }
}

// Reports & Financials Hero Image Upload
const uploadReportsFinancialsHeroImage = multer({
  storage: multerS3({
    s3: s3,
    bucket: process.env.AWSS_BUCKET_NAME,
    contentType: multerS3.AUTO_CONTENT_TYPE,
    key: function (req, file, cb) {
      cb(null, `reports-financials/${Date.now().toString()}-${file.originalname}`);
    },
  }),
  limits: { fileSize: 2000000 }, // 2MB limit
  fileFilter: function (req, file, cb) {
    checkFileType(file, cb);
  },
}).single('heroImage');

// Slum Children Page Hero Image Upload
const uploadSlumChildrenHeroImage = multer({
  storage: multerS3({
    s3: s3,
    bucket: process.env.AWSS_BUCKET_NAME,
    contentType: multerS3.AUTO_CONTENT_TYPE,
    key: function (req, file, cb) {
      cb(null, `slum-children/${Date.now().toString()}-${file.originalname}`);
    },
  }),
  limits: { fileSize: 2000000 }, // 2MB limit
  fileFilter: function (req, file, cb) {
    checkFileType(file, cb);
  },
}).single('heroImage');

// Impact Report PDF Upload
const uploadImpactReportPDF = multer({
  storage: multerS3({
    s3: s3,
    bucket: process.env.AWSS_BUCKET_NAME,
    contentType: multerS3.AUTO_CONTENT_TYPE,
    key: function (req, file, cb) {
      cb(null, `reports-financials/${Date.now().toString()}-${file.originalname}`);
    },
  }),
  limits: { fileSize: 10485760 }, // Exactly 10MB (10 * 1024 * 1024 bytes)
  fileFilter: function (req, file, cb) {
    checkPDFFileType(file, cb);
  },
}).single('pdf');

// ==================== Elementary Middle School Page Uploads ====================

// Elementary Middle School Current Reach Image Upload
const uploadElementaryMiddleSchoolReachImage = multer({
  storage: multerS3({
    s3: s3,
    bucket: process.env.AWSS_BUCKET_NAME,
    contentType: multerS3.AUTO_CONTENT_TYPE,
    key: function (req, file, cb) {
      cb(null, `elementary-middle-school/${Date.now().toString()}-${file.originalname}`);
    },
  }),
  limits: { fileSize: 2000000 }, // 2MB limit
  fileFilter: function (req, file, cb) {
    checkFileType(file, cb);
  },
}).single('reachImage');

// Elementary Middle School Hero Image Upload
const uploadElementaryMiddleSchoolHeroImage = multer({
  storage: multerS3({
    s3: s3,
    bucket: process.env.AWSS_BUCKET_NAME,
    contentType: multerS3.AUTO_CONTENT_TYPE,
    key: function (req, file, cb) {
      cb(null, `elementary-middle-school/${Date.now().toString()}-${file.originalname}`);
    },
  }),
  limits: { fileSize: 2000000 }, // 2MB limit
  fileFilter: function (req, file, cb) {
    checkFileType(file, cb);
  },
}).single('heroImage');

// Elementary Middle School Mode of Delivery Image Upload
const uploadElementaryMiddleSchoolModeImage = multer({
  storage: multerS3({
    s3: s3,
    bucket: process.env.AWSS_BUCKET_NAME,
    contentType: multerS3.AUTO_CONTENT_TYPE,
    key: function (req, file, cb) {
      cb(null, `elementary-middle-school/${Date.now().toString()}-${file.originalname}`);
    },
  }),
  limits: { fileSize: 2000000 }, // 2MB limit
  fileFilter: function (req, file, cb) {
    checkFileType(file, cb);
  },
}).single('modeImage');

// Public Government School Page Hero Image Upload
const uploadPublicGovernmentSchoolHeroImage = multer({
  storage: multerS3({
    s3: s3,
    bucket: process.env.AWSS_BUCKET_NAME,
    contentType: multerS3.AUTO_CONTENT_TYPE,
    key: function (req, file, cb) {
      cb(null, `public-government-school/${Date.now().toString()}-${file.originalname}`);
    },
  }),
  limits: { fileSize: 2000000 }, // 2MB limit
  fileFilter: function (req, file, cb) {
    checkFileType(file, cb);
  },
}).single('heroImage');

// Public Government School Page Blended Learning Image Upload
const uploadPublicGovernmentSchoolBlendedImage = multer({
  storage: multerS3({
    s3: s3,
    bucket: process.env.AWSS_BUCKET_NAME,
    contentType: multerS3.AUTO_CONTENT_TYPE,
    key: function (req, file, cb) {
      cb(null, `public-government-school/${Date.now().toString()}-${file.originalname}`);
    },
  }),
  limits: { fileSize: 2000000 }, // 2MB limit
  fileFilter: function (req, file, cb) {
    checkFileType(file, cb);
  },
}).single('blendedImage');

// Public Government School Page Case Study Image Upload
const uploadPublicGovernmentSchoolCaseStudyImage = multer({
  storage: multerS3({
    s3: s3,
    bucket: process.env.AWSS_BUCKET_NAME,
    contentType: multerS3.AUTO_CONTENT_TYPE,
    key: function (req, file, cb) {
      cb(null, `public-government-school/${Date.now().toString()}-${file.originalname}`);
    },
  }),
  limits: { fileSize: 2000000 }, // 2MB limit
  fileFilter: function (req, file, cb) {
    checkFileType(file, cb);
  },
}).single('caseStudyImage');

// Public Government School Case Study PDF Upload
const uploadPublicGovernmentSchoolCaseStudyPDF = multer({
  storage: multerS3({
    s3: s3,
    bucket: process.env.AWSS_BUCKET_NAME,
    contentType: multerS3.AUTO_CONTENT_TYPE,
    key: function (req, file, cb) {
      cb(null, `public-government-school/case-study/${Date.now().toString()}-${file.originalname}`);
    },
  }),
  limits: { fileSize: 10485760 }, // Exactly 10MB (10 * 1024 * 1024 bytes)
  fileFilter: function (req, file, cb) {
    checkPDFFileType(file, cb);
  },
}).single('caseStudyPDF');

// ==================== NEI USA Introduction Page Uploads ====================

// NEI USA Introduction About Section Image Upload
const uploadNeiUsaIntroductionAboutImage = multer({
  storage: multerS3({
    s3: s3,
    bucket: process.env.AWSS_BUCKET_NAME,
    contentType: multerS3.AUTO_CONTENT_TYPE,
    key: function (req, file, cb) {
      cb(null, `nei-usa-introduction/${Date.now().toString()}-${file.originalname}`);
    },
  }),
  limits: { fileSize: 2000000 }, // 2MB limit
  fileFilter: function (req, file, cb) {
    checkFileType(file, cb);
  },
}).single('aboutImage');

// NEI USA Introduction Who We Serve Section Image Upload
const uploadNeiUsaIntroductionWhoWeServeImage = multer({
  storage: multerS3({
    s3: s3,
    bucket: process.env.AWSS_BUCKET_NAME,
    contentType: multerS3.AUTO_CONTENT_TYPE,
    key: function (req, file, cb) {
      cb(null, `nei-usa-introduction/${Date.now().toString()}-${file.originalname}`);
    },
  }),
  limits: { fileSize: 2000000 }, // 2MB limit
  fileFilter: function (req, file, cb) {
    checkFileType(file, cb);
  },
}).single('whoWeServeImage');

// NEI USA Introduction What We Offer Section Image Upload
const uploadNeiUsaIntroductionWhatWeOfferImage = multer({
  storage: multerS3({
    s3: s3,
    bucket: process.env.AWSS_BUCKET_NAME,
    contentType: multerS3.AUTO_CONTENT_TYPE,
    key: function (req, file, cb) {
      cb(null, `nei-usa-introduction/${Date.now().toString()}-${file.originalname}`);
    },
  }),
  limits: { fileSize: 2000000 }, // 2MB limit
  fileFilter: function (req, file, cb) {
    checkFileType(file, cb);
  },
}).single('whatWeOfferImage');

// Soft Skill Training Page Hero Image Upload
const uploadSoftSkillTrainingHeroImage = multer({
  storage: multerS3({
    s3: s3,
    bucket: process.env.AWSS_BUCKET_NAME,
    contentType: multerS3.AUTO_CONTENT_TYPE,
    key: function (req, file, cb) {
      cb(null, `soft-skill-training/${Date.now().toString()}-${file.originalname}`);
    },
  }),
  limits: { fileSize: 2000000 }, // 2MB limit
  fileFilter: function (req, file, cb) {
    checkFileType(file, cb);
  },
}).single('heroImage');

// Girls Education Page Hero Image Upload
const uploadGirlsEducationHeroImage = multer({
  storage: multerS3({
    s3: s3,
    bucket: process.env.AWSS_BUCKET_NAME,
    contentType: multerS3.AUTO_CONTENT_TYPE,
    key: function (req, file, cb) {
      cb(null, `girls-education/${Date.now().toString()}-${file.originalname}`);
    },
  }),
  limits: { fileSize: 2000000 }, // 2MB limit
  fileFilter: function (req, file, cb) {
    checkFileType(file, cb);
  },
}).single('heroImage');

// Girls Education Page Impact Image Upload
const uploadGirlsEducationImpactImage = multer({
  storage: multerS3({
    s3: s3,
    bucket: process.env.AWSS_BUCKET_NAME,
    contentType: multerS3.AUTO_CONTENT_TYPE,
    key: function (req, file, cb) {
      cb(null, `girls-education/${Date.now().toString()}-${file.originalname}`);
    },
  }),
  limits: { fileSize: 2000000 }, // 2MB limit
  fileFilter: function (req, file, cb) {
    checkFileType(file, cb);
  },
}).single('impactImage');

// Out Of School / Dropout Page Images
const uploadOutOfSchoolDropoutHeroImage = multer({
  storage: multerS3({
    s3, bucket: process.env.AWSS_BUCKET_NAME, contentType: multerS3.AUTO_CONTENT_TYPE,
    key: function (req, file, cb) { cb(null, `out-of-school-dropout/${Date.now().toString()}-${file.originalname}`); }
  }),
  limits: { fileSize: 2000000 },
  fileFilter: function (req, file, cb) { checkFileType(file, cb); },
}).single('heroImage');

const uploadOutOfSchoolDropoutFeaturedImage = multer({
  storage: multerS3({
    s3, bucket: process.env.AWSS_BUCKET_NAME, contentType: multerS3.AUTO_CONTENT_TYPE,
    key: function (req, file, cb) { cb(null, `out-of-school-dropout/${Date.now().toString()}-${file.originalname}`); }
  }),
  limits: { fileSize: 2000000 },
  fileFilter: function (req, file, cb) { checkFileType(file, cb); },
}).single('featuredImage');

const uploadOutOfSchoolDropoutSecondImage = multer({
  storage: multerS3({
    s3, bucket: process.env.AWSS_BUCKET_NAME, contentType: multerS3.AUTO_CONTENT_TYPE,
    key: function (req, file, cb) { cb(null, `out-of-school-dropout/${Date.now().toString()}-${file.originalname}`); }
  }),
  limits: { fileSize: 2000000 },
  fileFilter: function (req, file, cb) { checkFileType(file, cb); },
}).single('secondImage');

const uploadOutOfSchoolDropoutGalleryImage = multer({
  storage: multerS3({
    s3, bucket: process.env.AWSS_BUCKET_NAME, contentType: multerS3.AUTO_CONTENT_TYPE,
    key: function (req, file, cb) { cb(null, `out-of-school-dropout/gallery/${Date.now().toString()}-${file.originalname}`); }
  }),
  limits: { fileSize: 2000000 },
  fileFilter: function (req, file, cb) { checkFileType(file, cb); },
}).single('galleryImage');

// Madrasa Page Images
const uploadMadrasaHeroImage = multer({
  storage: multerS3({
    s3, bucket: process.env.AWSS_BUCKET_NAME, contentType: multerS3.AUTO_CONTENT_TYPE,
    key: function (req, file, cb) { cb(null, `madrasa/${Date.now().toString()}-${file.originalname}`); }
  }),
  limits: { fileSize: 2000000 },
  fileFilter: function (req, file, cb) { checkFileType(file, cb); },
}).single('heroImage');

const uploadMadrasaImage1 = multer({
  storage: multerS3({
    s3, bucket: process.env.AWSS_BUCKET_NAME, contentType: multerS3.AUTO_CONTENT_TYPE,
    key: function (req, file, cb) { cb(null, `madrasa/${Date.now().toString()}-${file.originalname}`); }
  }),
  limits: { fileSize: 2000000 },
  fileFilter: function (req, file, cb) { checkFileType(file, cb); },
}).single('image1');

const uploadMadrasaImage2 = multer({
  storage: multerS3({
    s3, bucket: process.env.AWSS_BUCKET_NAME, contentType: multerS3.AUTO_CONTENT_TYPE,
    key: function (req, file, cb) { cb(null, `madrasa/${Date.now().toString()}-${file.originalname}`); }
  }),
  limits: { fileSize: 2000000 },
  fileFilter: function (req, file, cb) { checkFileType(file, cb); },
}).single('image2');

// ==================== Partners Join Page Uploads ====================
// Header Image
const uploadPartnersJoinHeaderImage = multer({
  storage: multerS3({
    s3: s3,
    bucket: process.env.AWSS_BUCKET_NAME,
    contentType: multerS3.AUTO_CONTENT_TYPE,
    key: function (req, file, cb) {
      cb(null, `partners-join/${Date.now().toString()}-${file.originalname}`);
    },
  }),
  limits: { fileSize: 2000000 },
  fileFilter: function (req, file, cb) {
    checkFileType(file, cb);
  },
}).single('heroImage');

// Charities Symbolic Image
const uploadPartnersJoinSymbolicImage = multer({
  storage: multerS3({
    s3: s3,
    bucket: process.env.AWSS_BUCKET_NAME,
    contentType: multerS3.AUTO_CONTENT_TYPE,
    key: function (req, file, cb) {
      cb(null, `partners-join/${Date.now().toString()}-${file.originalname}`);
    },
  }),
  limits: { fileSize: 2000000 },
  fileFilter: function (req, file, cb) {
    checkFileType(file, cb);
  },
}).single('symbolicImage');

// Technical Skill Training Page Uploads
const uploadTechnicalSkillTrainingHeroImage = multer({
  storage: multerS3({
    s3: s3,
    bucket: process.env.AWSS_BUCKET_NAME,
    contentType: multerS3.AUTO_CONTENT_TYPE,
    key: function (req, file, cb) {
      cb(null, `technical-skill-training/${Date.now().toString()}-${file.originalname}`);
    },
  }),
  limits: { fileSize: 2000000 },
  fileFilter: function (req, file, cb) {
    checkFileType(file, cb);
  },
}).single('heroImage');

const uploadTechnicalSkillTrainingModeImage = multer({
  storage: multerS3({
    s3: s3,
    bucket: process.env.AWSS_BUCKET_NAME,
    contentType: multerS3.AUTO_CONTENT_TYPE,
    key: function (req, file, cb) {
      cb(null, `technical-skill-training/modes/${Date.now().toString()}-${file.originalname}`);
    },
  }),
  limits: { fileSize: 2000000 },
  fileFilter: function (req, file, cb) {
    checkFileType(file, cb);
  },
}).single('modeImage');

// Adult Education Page Uploads
const uploadAdultEducationHeroImage = multer({
  storage: multerS3({
    s3, bucket: process.env.AWSS_BUCKET_NAME, contentType: multerS3.AUTO_CONTENT_TYPE,
    key: function (req, file, cb) { cb(null, `adult-education/${Date.now().toString()}-${file.originalname}`); }
  }),
  limits: { fileSize: 2000000 },
  fileFilter: function (req, file, cb) { checkFileType(file, cb); },
}).single('heroImage');

const uploadAdultEducationWhyImage = multer({
  storage: multerS3({
    s3, bucket: process.env.AWSS_BUCKET_NAME, contentType: multerS3.AUTO_CONTENT_TYPE,
    key: function (req, file, cb) { cb(null, `adult-education/${Date.now().toString()}-${file.originalname}`); }
  }),
  limits: { fileSize: 2000000 },
  fileFilter: function (req, file, cb) { checkFileType(file, cb); },
}).single('whyImage');

// Teachers Training Page Uploads
const uploadTeachersTrainingHeroImage = multer({
  storage: multerS3({ s3, bucket: process.env.AWSS_BUCKET_NAME, contentType: multerS3.AUTO_CONTENT_TYPE, key: function (req, file, cb) { cb(null, `teachers-training/${Date.now().toString()}-${file.originalname}`); } }),
  limits: { fileSize: 2000000 },
  fileFilter: function (req, file, cb) { checkFileType(file, cb); }
}).single('heroImage');

const uploadTeachersTrainingImageSection = multer({
  storage: multerS3({ s3, bucket: process.env.AWSS_BUCKET_NAME, contentType: multerS3.AUTO_CONTENT_TYPE, key: function (req, file, cb) { cb(null, `teachers-training/${Date.now().toString()}-${file.originalname}`); } }),
  limits: { fileSize: 2000000 },
  fileFilter: function (req, file, cb) { checkFileType(file, cb); }
}).single('image');

// Global Education Page Uploads
const uploadGlobalEducationMissionImage = multer({
  storage: multerS3({
    s3, bucket: process.env.AWSS_BUCKET_NAME, contentType: multerS3.AUTO_CONTENT_TYPE,
    key: function (req, file, cb) { cb(null, `global-education/${Date.now().toString()}-${file.originalname}`); }
  }),
  limits: { fileSize: 2000000 },
  fileFilter: function (req, file, cb) { checkFileType(file, cb); },
}).single('missionImage');

const uploadGlobalEducationEquityImage = multer({
  storage: multerS3({
    s3, bucket: process.env.AWSS_BUCKET_NAME, contentType: multerS3.AUTO_CONTENT_TYPE,
    key: function (req, file, cb) { cb(null, `global-education/${Date.now().toString()}-${file.originalname}`); }
  }),
  limits: { fileSize: 2000000 },
  fileFilter: function (req, file, cb) { checkFileType(file, cb); },
}).single('equityImage');

const uploadGlobalEducationBannerImage = multer({
  storage: multerS3({
    s3, bucket: process.env.AWSS_BUCKET_NAME, contentType: multerS3.AUTO_CONTENT_TYPE,
    key: function (req, file, cb) { cb(null, `global-education/${Date.now().toString()}-${file.originalname}`); }
  }),
  limits: { fileSize: 3000000 },
  fileFilter: function (req, file, cb) { checkFileType(file, cb); },
}).single('bannerImage');

// Global Education Hero Image
const uploadGlobalEducationHeroImage = multer({
  storage: multerS3({
    s3, bucket: process.env.AWSS_BUCKET_NAME, contentType: multerS3.AUTO_CONTENT_TYPE,
    key: function (req, file, cb) { cb(null, `global-education/${Date.now().toString()}-${file.originalname}`); }
  }),
  limits: { fileSize: 2000000 },
  fileFilter: function (req, file, cb) { checkFileType(file, cb); },
}).single('heroImage');

// Be A Partner Header Image Upload
const uploadBeAPartnerHeaderImage = multer({
  storage: multerS3({
    s3, bucket: process.env.AWSS_BUCKET_NAME, contentType: multerS3.AUTO_CONTENT_TYPE,
    key: function (req, file, cb) { cb(null, `be-a-partner/${Date.now().toString()}-${file.originalname}`); }
  }),
  limits: { fileSize: 2000000 },
  fileFilter: function (req, file, cb) { checkFileType(file, cb); },
}).single('headerImage');

// Privacy Policy Hero Image
const uploadPrivacyPolicyHeroImage = multer({
  storage: multerS3({
    s3, bucket: process.env.AWSS_BUCKET_NAME, contentType: multerS3.AUTO_CONTENT_TYPE,
    key: function (req, file, cb) { cb(null, `privacy-policy/${Date.now().toString()}-${file.originalname}`); }
  }),
  limits: { fileSize: 2000000 },
  fileFilter: function (req, file, cb) { checkFileType(file, cb); },
}).single('heroImage');

// ==================== Homepage Uploads ====================

// Homepage Banner Slides Upload (up to 6 images)
const uploadHomepageBannerSlides = multer({
  storage: multerS3({
    s3: s3,
    bucket: process.env.AWSS_BUCKET_NAME,
    contentType: multerS3.AUTO_CONTENT_TYPE,
    key: function (req, file, cb) {
      cb(null, `homepage/banner/${Date.now().toString()}-${file.originalname}`);
    },
  }),
  limits: { fileSize: 2000000 }, // 2MB per image
  fileFilter: function (req, file, cb) {
    checkFileType(file, cb);
  },
}).array('images', 6); // Allow up to 6 images

// Homepage Our Mission Section Image Upload
const uploadHomepageOurMissionImage = multer({
  storage: multerS3({
    s3: s3,
    bucket: process.env.AWSS_BUCKET_NAME,
    contentType: multerS3.AUTO_CONTENT_TYPE,
    key: function (req, file, cb) {
      cb(null, `homepage/our-mission/${Date.now().toString()}-${file.originalname}`);
    },
  }),
  limits: { fileSize: 2000000 }, // 2MB limit
  fileFilter: function (req, file, cb) {
    checkFileType(file, cb);
  },
}).single('image');

// Homepage Leadership Section Image Upload (under Our Mission)
const uploadHomepageLeadershipImage = multer({
  storage: multerS3({
    s3: s3,
    bucket: process.env.AWSS_BUCKET_NAME,
    contentType: multerS3.AUTO_CONTENT_TYPE,
    key: function (req, file, cb) {
      cb(null, `homepage/our-mission/leadership/${Date.now().toString()}-${file.originalname}`);
    },
  }),
  limits: { fileSize: 2000000 }, // 2MB limit
  fileFilter: function (req, file, cb) {
    checkFileType(file, cb);
  },
}).single('image');

// Homepage Innovation Section Image Upload
const uploadHomepageInnovationImage = multer({
  storage: multerS3({
    s3: s3,
    bucket: process.env.AWSS_BUCKET_NAME,
    contentType: multerS3.AUTO_CONTENT_TYPE,
    key: function (req, file, cb) {
      cb(null, `homepage/innovation/${Date.now().toString()}-${file.originalname}`);
    },
  }),
  limits: { fileSize: 2000000 }, // 2MB limit
  fileFilter: function (req, file, cb) {
    checkFileType(file, cb);
  },
}).single('image');

// Homepage Global Programs Section Image Upload
const uploadHomepageGlobalProgramsImage = multer({
  storage: multerS3({
    s3: s3,
    bucket: process.env.AWSS_BUCKET_NAME,
    contentType: multerS3.AUTO_CONTENT_TYPE,
    key: function (req, file, cb) {
      cb(null, `homepage/global-programs/${Date.now().toString()}-${file.originalname}`);
    },
  }),
  limits: { fileSize: 2000000 }, // 2MB limit
  fileFilter: function (req, file, cb) {
    checkFileType(file, cb);
  },
}).single('image');

// Homepage Testimonials Image Upload (for testimonial items)
const uploadHomepageTestimonialImage = multer({
  storage: multerS3({
    s3: s3,
    bucket: process.env.AWSS_BUCKET_NAME,
    contentType: multerS3.AUTO_CONTENT_TYPE,
    key: function (req, file, cb) {
      cb(null, `homepage/testimonials/${Date.now().toString()}-${file.originalname}`);
    },
  }),
  limits: { fileSize: 2000000 }, // 2MB limit
  fileFilter: function (req, file, cb) {
    checkFileType(file, cb);
  },
}).single('image');

export default upload;
export {
  upload,
  uploadInstitutionFiles,
  uploadCarouselImages,
  uploadSectionsImage,
  uploadVideoThumbnail,
  uploadTestimonialsImage,
  uploadHomeStatisticsBackgroundImage,
  uploadLeadershipImage,
  uploadGalleryImage,
  uploadPartnerInstitutionFeaturedImage,
  uploadPartnerInstitutionDetailImages,
  uploadPartnerInstitutionImages,
  uploadPartneringInstitutionPageImage,
  uploadRemoteLearningHeaderImage,
  uploadBlendedLearningHeaderImage,
  uploadBlendedLearningSupportingImage,
  uploadDOPHeroImage,
  uploadDOPIntroductionImage,
  uploadDOPFounderImage,
  uploadDOPFeatureImage,
  uploadAppTechHeroImage,
  uploadAppTechDigitalClassroomImage,
  uploadAppTechOnboardingImage,
  uploadAppTechAIImage,
  uploadReportsFinancialsHeroImage,
  uploadImpactReportPDF,
  uploadElementaryMiddleSchoolHeroImage,
  uploadElementaryMiddleSchoolReachImage,
  uploadElementaryMiddleSchoolModeImage,
  uploadSlumChildrenHeroImage,
  uploadPublicGovernmentSchoolHeroImage,
  uploadPublicGovernmentSchoolBlendedImage,
  uploadPublicGovernmentSchoolCaseStudyImage,
  uploadPublicGovernmentSchoolCaseStudyPDF,
  uploadGirlsEducationHeroImage,
  uploadGirlsEducationImpactImage,
  uploadOutOfSchoolDropoutHeroImage,
  uploadOutOfSchoolDropoutFeaturedImage,
  uploadOutOfSchoolDropoutSecondImage,
  uploadOutOfSchoolDropoutGalleryImage,
  uploadMadrasaHeroImage,
  uploadMadrasaImage1,
  uploadMadrasaImage2,
  uploadNeiUsaIntroductionAboutImage,
  uploadNeiUsaIntroductionWhoWeServeImage,
  uploadNeiUsaIntroductionWhatWeOfferImage,
  uploadSoftSkillTrainingHeroImage,
  uploadPartnersJoinHeaderImage,
  uploadPartnersJoinSymbolicImage,
  uploadTechnicalSkillTrainingHeroImage as uploadTechnicalSkillTrainingHeroImageMiddleware,
  uploadTechnicalSkillTrainingModeImage as uploadTechnicalSkillTrainingModeImageMiddleware,
  uploadAdultEducationHeroImage,
  uploadAdultEducationWhyImage,
  uploadTeachersTrainingHeroImage as uploadTeachersTrainingHeroImageMiddleware,
  uploadTeachersTrainingImageSection as uploadTeachersTrainingImageSectionMiddleware,
  uploadBeAPartnerHeaderImage,
  uploadGlobalEducationMissionImage,
  uploadGlobalEducationEquityImage,
  uploadGlobalEducationBannerImage,
  uploadGlobalEducationHeroImage,
  uploadPrivacyPolicyHeroImage,
  uploadHomepageBannerSlides,
  uploadHomepageOurMissionImage,
  uploadHomepageLeadershipImage,
  uploadHomepageInnovationImage,
  uploadHomepageGlobalProgramsImage,
  uploadHomepageTestimonialImage,
  uploadNewsImage
};


