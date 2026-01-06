import mongoose from "mongoose";

const challengeItemSchema = new mongoose.Schema({
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

const modelItemSchema = new mongoose.Schema({
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

const caseStudyResultSchema = new mongoose.Schema({
  icon: {
    type: String,
    trim: true
  },
  text: {
    type: String,
    required: true,
    trim: true
  },
  display_order: {
    type: Number,
    default: 0
  }
}, { _id: true });

const pilotGoalSchema = new mongoose.Schema({
  text: {
    type: String,
    required: true,
    trim: true
  },
  display_order: {
    type: Number,
    default: 0
  }
}, { _id: true });

const whyPartnerItemSchema = new mongoose.Schema({
  number: {
    type: String,
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

const callToActionItemSchema = new mongoose.Schema({
  text: {
    type: String,
    required: true,
    trim: true
  },
  display_order: {
    type: Number,
    default: 0
  }
}, { _id: true });

const publicGovernmentSchoolPageSchema = new mongoose.Schema({
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
    }
  },
  // Introduction Section
  introductionSection: {
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
  // Blended Learning Model Section
  blendedLearningSection: {
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
      trim: true
    }
  },
  // Challenges Section
  challengesSection: {
    heading: {
      type: String,
      required: true,
      trim: true
    },
    challenges: [challengeItemSchema]
  },
  // NEIEA's Model Section
  modelSection: {
    heading: {
      type: String,
      required: true,
      trim: true
    },
    introText: {
      type: String,
      trim: true
    },
    models: [modelItemSchema]
  },
  // Case Study Section
  caseStudySection: {
    heading: {
      type: String,
      required: true,
      trim: true
    },
    description: {
      type: String,
      trim: true
    },
    results: [caseStudyResultSchema],
    image: {
      type: String,
      trim: true
    },
    pdfUrl: {
      type: String,
      trim: true
    }
  },
  // Pilot Project Section
  pilotProjectSection: {
    heading: {
      type: String,
      required: true,
      trim: true
    },
    description: {
      type: String,
      trim: true
    },
    proposalHeading: {
      type: String,
      trim: true
    },
    proposalDescription: {
      type: String,
      trim: true
    },
    stats: {
      targetSchools: {
        type: String,
        trim: true
      },
      studentsBenefiting: {
        type: String,
        trim: true
      },
      classSize: {
        type: String,
        trim: true
      },
      duration: {
        type: String,
        trim: true
      }
    },
    coordinatorInfo: {
      type: String,
      trim: true
    },
    goals: [pilotGoalSchema]
  },
  // Why Partner Section
  whyPartnerSection: {
    heading: {
      type: String,
      required: true,
      trim: true
    },
    reasons: [whyPartnerItemSchema]
  },
  // Call to Action Section
  callToActionSection: {
    heading: {
      type: String,
      required: true,
      trim: true
    },
    description: {
      type: String,
      trim: true
    },
    actionItems: [callToActionItemSchema],
    closingText: {
      type: String,
      trim: true
    },
    quote: {
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

// Index for better performance
publicGovernmentSchoolPageSchema.index({ is_active: 1 });

export default mongoose.model('PublicGovernmentSchoolPage', publicGovernmentSchoolPageSchema);
