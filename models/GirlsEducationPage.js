import mongoose from "mongoose";

const initiativeSchema = new mongoose.Schema({
  icon: {
    type: String,
    required: true,
    trim: true
  },
  title: {
    type: String,
    required: true,
    trim: true
  },
  partner: {
    type: String,
    required: true,
    trim: true
  },
  location: {
    type: String,
    required: true,
    trim: true
  },
  startDate: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    required: true,
    trim: true
  },
  achievements: [{
    type: String,
    trim: true
  }],
  display_order: {
    type: Number,
    default: 0
  }
}, { _id: true });

const partnerOrganizationSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  display_order: {
    type: Number,
    default: 0
  }
}, { _id: true });

const partnerOrganizationsByStateSchema = new mongoose.Schema({
  state: {
    type: String,
    required: true,
    trim: true
  },
  partners: [partnerOrganizationSchema],
  display_order: {
    type: Number,
    default: 0
  }
}, { _id: true });

const futureVisionCardSchema = new mongoose.Schema({
  icon: {
    type: String,
    required: false,
    trim: true
  },
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
  display_order: {
    type: Number,
    default: 0
  }
}, { _id: true });

const girlsEducationPageSchema = new mongoose.Schema({
  // Hero Section
  heroSection: {
    title: {
      type: String,
      required: true,
      trim: true
    },
    subtitle: {
      type: String,
      trim: true
    },
    description: {
      type: String,
      trim: true
    },
    heroImage: {
      type: String,
      trim: true
    },
    videoLink: {
      type: String,
      trim: true
    }
  },
  // Vision and Philosophy Section
  visionAndPhilosophySection: {
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
    philosophyHeading: {
      type: String,
      trim: true
    },
    philosophyDescription: {
      type: String,
      trim: true
    }
  },
  // On-the-Ground Initiatives Section
  initiativesSection: {
    label: {
      type: String,
      trim: true
    },
    heading: {
      type: String,
      required: true,
      trim: true
    },
    description: {
      type: String,
      trim: true
    },
    initiatives: [initiativeSchema]
  },
  // Our Impact Section
  impactSection: {
    label: {
      type: String,
      trim: true
    },
    heading: {
      type: String,
      required: true,
      trim: true
    },
    totalImpact: {
      image: {
        type: String,
        trim: true
      },
      title: {
        type: String,
        required: true,
        trim: true
      },
      stats: {
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
    partnerOrganizationsByState: [partnerOrganizationsByStateSchema]
  },
  // Looking Forward Section
  lookingForwardSection: {
    label: {
      type: String,
      trim: true
    },
    heading: {
      type: String,
      required: true,
      trim: true
    },
    futureVisionCards: [futureVisionCardSchema]
  },
  // Scalable Model Section
  scalableModelSection: {
    heading: {
      type: String,
      required: true,
      trim: true
    },
    highlightedText: {
      type: String,
      required: true,
      trim: true
    }
  },
  // Join the Movement Section
  joinMovementSection: {
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
    supportButtonText: {
      type: String,
      trim: true,
      default: "💝 Support Girls' Education"
    },
    supportButtonLink: {
      type: String,
      trim: true,
      default: "/donate"
    },
    getInvolvedButtonText: {
      type: String,
      trim: true,
      default: "📞 Get Involved"
    },
    getInvolvedButtonLink: {
      type: String,
      trim: true,
      default: "/about-us/contact"
    }
  },
  is_active: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true
});

// Index for better performance
girlsEducationPageSchema.index({ is_active: 1 });

export default mongoose.model('GirlsEducationPage', girlsEducationPageSchema);

