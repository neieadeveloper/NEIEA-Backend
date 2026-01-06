import mongoose from "mongoose";

// Key Feature Schema (Lenient - no required fields)
const keyFeatureSchema = new mongoose.Schema({
  icon: {
    type: String,
    trim: true,
    default: ''
  },
  title: {
    type: String,
    trim: true,
    default: ''
  },
  description: {
    type: String,
    trim: true,
    default: ''
  },
  subtitle: {
    type: String,
    trim: true,
    default: ''
  },
  image: {
    type: String,
    trim: true,
    default: ''
  },
  display_order: {
    type: Number,
    default: 0
  }
}, { _id: true });

// Additional Resource Schema (Lenient - no required fields)
const additionalResourceSchema = new mongoose.Schema({
  icon: {
    type: String,
    trim: true,
    default: ''
  },
  title: {
    type: String,
    trim: true,
    default: ''
  },
  description: {
    type: String,
    trim: true,
    default: ''
  },
  ctaText: {
    type: String,
    trim: true,
    default: ''
  },
  ctaLink: {
    type: String,
    trim: true,
    default: '#'
  },
  backgroundColor: {
    type: String,
    trim: true,
    default: '#06038F'
  },
  display_order: {
    type: Number,
    default: 0
  }
}, { _id: true });

// Main DOP Page Schema
const discourseOrientedPedagogyPageSchema = new mongoose.Schema({
  // Header Section
  headerSection: {
    title: {
      type: String,
      required: true,
      trim: true,
      default: 'Discourse-Oriented Pedagogy (DOP)'
    },
    subtitle: {
      type: String,
      trim: true,
      default: 'By Syed Danish Ali'
    },
    shortDescription: {
      type: String,
      required: true,
      trim: true
    },
    heroImage: {
      type: String,
      trim: true
    },
    heroVideoUrl: {
      type: String,
      trim: true
    }
  },

  // Introduction Section
  introductionSection: {
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
      trim: true
    }
  },

  // Founder Section
  founderSection: {
    name: {
      type: String,
      required: true,
      trim: true
    },
    title: {
      type: String,
      required: true,
      trim: true
    },
    quote: {
      type: String,
      required: true,
      trim: true
    },
    image: {
      type: String,
      trim: true
    }
  },

  // Key Features Section (Lenient - no required fields)
  keyFeaturesSection: {
    title: {
      type: String,
      trim: true,
      default: 'Key Features of DOP'
    },
    features: [keyFeatureSchema]
  },

  // Additional Resources Section (Lenient - no required fields)
  additionalResourcesSection: {
    title: {
      type: String,
      trim: true,
      default: 'Additional Resources'
    },
    resources: [additionalResourceSchema]
  },

  // Call to Action Section (Lenient - no required fields)
  callToActionSection: {
    title: {
      type: String,
      trim: true,
      default: ''
    },
    description: {
      type: String,
      trim: true,
      default: ''
    },
    primaryButtonText: {
      type: String,
      trim: true,
      default: 'Get Started with DOP'
    },
    primaryButtonLink: {
      type: String,
      trim: true,
      default: '/about-us/contact'
    },
    secondaryButtonText: {
      type: String,
      trim: true,
      default: 'Watch Demo Videos'
    },
    secondaryButtonLink: {
      type: String,
      trim: true,
      default: '#'
    }
  },

  // Footer Section (Optional)
  footerSection: {
    showLogo: {
      type: Boolean,
      default: false
    },
    customText: {
      type: String,
      trim: true
    }
  },

  is_active: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true
});

// Indexes for better performance
discourseOrientedPedagogyPageSchema.index({ is_active: 1 });

export default mongoose.model('DiscourseOrientedPedagogyPage', discourseOrientedPedagogyPageSchema);

