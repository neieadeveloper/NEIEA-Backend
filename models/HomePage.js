import mongoose from "mongoose";

// Banner slide schema
const bannerSlideSchema = new mongoose.Schema({
  image: {
    type: String,
    required: true,
    trim: true
  },
  alt: {
    type: String,
    required: true,
    trim: true
  },
  // Hero Text Overlay Fields
  headingText: {
    type: String,
    trim: true,
    default: ''
  },
  subHeadingText: {
    type: String,
    trim: true,
    default: ''
  },
  textPosition: {
    type: String,
    enum: ['left', 'center', 'right'],
    default: 'center'
  },
  textColor: {
    type: String,
    default: '#ffffff' // hex color
  },
  backgroundOverlay: {
    type: String,
    default: 'rgba(0, 0, 0, 0.4)' // rgba for transparency
  },
  textOverlayActive: {
    type: Boolean,
    default: true
  },
  display_order: {
    type: Number,
    default: 0
  }
}, { _id: true });

// Banner section schema
const bannerSectionSchema = new mongoose.Schema({
  slides: [bannerSlideSchema],
  is_active: {
    type: Boolean,
    default: true
  }
});

// Our Mission section schema
const ourMissionSectionSchema = new mongoose.Schema({
  mission: {
    heading: {
      type: String,
      required: true,
      trim: true
    },
    description: {
      type: String,
      required: true,
      trim: true
    },
    image: {
      type: String,
      required: true,
      trim: true
    }
  },
  vision: {
    heading: {
      type: String,
      required: true,
      trim: true
    },
    description: {
      type: String,
      required: true,
      trim: true
    }
  },
  leadership: {
    heading: {
      type: String,
      required: true,
      trim: true
    },
    description: {
      type: String,
      required: true,
      trim: true
    },
    image: {
      type: String,
      required: true,
      trim: true
    },
    leaderName: {
      type: String,
      required: true,
      trim: true
    },
    leaderTitle: {
      type: String,
      required: true,
      trim: true
    }
  },
  is_active: {
    type: Boolean,
    default: true
  }
});

// Innovation section schema
const innovationSectionSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    required: true,
    trim: true
  },
  image: {
    type: String,
    required: true,
    trim: true
  },
  buttonText: {
    type: String,
    required: true,
    trim: true
  },
  buttonLink: {
    type: String,
    required: true,
    trim: true
  },
  is_active: {
    type: Boolean,
    default: true
  }
});

// Global Programs section schema
const globalProgramsSectionSchema = new mongoose.Schema({
  title1: {
    type: String,
    required: true,
    trim: true
  },
  description1: {
    type: String,
    required: true,
    trim: true
  },
  title2: {
    type: String,
    required: true,
    trim: true
  },
  description2: {
    type: String,
    required: true,
    trim: true
  },
  image: {
    type: String,
    required: true,
    trim: true
  },
  buttonText: {
    type: String,
    required: true,
    trim: true
  },
  buttonLink: {
    type: String,
    required: true,
    trim: true
  },
  is_active: {
    type: Boolean,
    default: true
  }
});

// Statistics item schema
const statisticsItemSchema = new mongoose.Schema({
  label: {
    type: String,
    required: true,
    trim: true
  },
  value: {
    type: Number,
    required: true
  },
  suffix: {
    type: String,
    default: ""
  },
  display_order: {
    type: Number,
    default: 0
  }
}, { _id: true });

// Statistics section schema
const statisticsSectionSchema = new mongoose.Schema({
  heading: {
    type: String,
    required: true,
    trim: true
  },
  backgroundImage: {
    type: String,
    trim: true,
    default: ''
  },
  statistics: [statisticsItemSchema],
  is_active: {
    type: Boolean,
    default: true
  }
});

// Testimonial item schema
const testimonialItemSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
    maxlength: 100
  },
  location: {
    type: String,
    trim: true,
    maxlength: 100
  },
  testimonial: {
    type: String,
    required: true,
    trim: true,
    maxlength: 1000
  },
  image: {
    type: String,
    required: false,
    trim: true
  },
  quoteIcon: {
    type: String,
    required: true,
    trim: true
  },
  isVideo: {
    type: Boolean,
    default: false
  },
  videoUrl: {
    type: String,
    trim: true
  },
  display_order: {
    type: Number,
    default: 0
  }
}, { timestamps: true });

// Testimonials section schema
const testimonialsSectionSchema = new mongoose.Schema({
  heading: {
    type: String,
    trim: true,
    default: 'Testimonials'
  },
  testimonials: [testimonialItemSchema],
  is_active: {
    type: Boolean,
    default: true
  }
});

// Main HomePage schema
const homePageSchema = new mongoose.Schema({
  banner: bannerSectionSchema,
  ourMission: ourMissionSectionSchema,
  innovationSection: innovationSectionSchema,
  globalPrograms: globalProgramsSectionSchema,
  statistics: statisticsSectionSchema,
  testimonials: testimonialsSectionSchema,
  is_active: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true
});

// Index for better performance
homePageSchema.index({ is_active: 1 });

export default mongoose.model('HomePage', homePageSchema);
