import mongoose from "mongoose";

const challengeItemSchema = new mongoose.Schema({
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

const responseItemSchema = new mongoose.Schema({
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

const programItemSchema = new mongoose.Schema({
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

const testimonialItemSchema = new mongoose.Schema({
  text: {
    type: String,
    required: true,
    trim: true
  },
  author: {
    type: String,
    required: true,
    trim: true
  },
  role: {
    type: String,
    required: true,
    trim: true
  },
  avatar: {
    type: String,
    trim: true
  },
  display_order: {
    type: Number,
    default: 0
  }
}, { _id: true });

const elementaryMiddleSchoolPageSchema = new mongoose.Schema({
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
  introduction: {
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
  // Why This Work Matters Section
  whyThisWorkMattersSection: {
    label: {
      type: String,
      trim: true
    },
    heading: {
      type: String,
      required: true,
      trim: true
    },
    nationalAssessmentData: {
      heading: {
        type: String,
        trim: true
      },
      items: [{
        type: String,
        trim: true
      }]
    },
    interventionStrategy: {
      heading: {
        type: String,
        trim: true
      },
      description: {
        type: String,
        trim: true
      }
    }
  },
  // Structural Challenges Section
  structuralChallengesSection: {
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
    challenges: [challengeItemSchema]
  },
  // NEIEA's Response Section
  neieaResponseSection: {
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
    responses: [responseItemSchema]
  },
  // Programs & Interventions Section
  programsSection: {
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
    programs: [programItemSchema]
  },
  // Reach & Impact Section
  reachImpactSection: {
    label: {
      type: String,
      trim: true
    },
    heading: {
      type: String,
      required: true,
      trim: true
    },
    currentReach: {
      image: {
        type: String,
        trim: true
      },
      title: {
        type: String,
        trim: true
      },
      stats: {
        type: String,
        trim: true
      },
      description: {
        type: String,
        trim: true
      }
    },
    caseStudy: {
      icon: {
        type: String,
        trim: true
      },
      heading: {
        type: String,
        trim: true
      },
      description: {
        type: String,
        trim: true
      },
      solution: {
        type: String,
        trim: true
      }
    }
  },
  // Testimonials Section
  testimonialsSection: {
    label: {
      type: String,
      trim: true
    },
    heading: {
      type: String,
      required: true,
      trim: true
    },
    testimonials: [testimonialItemSchema]
  },
  // Mode of Delivery Section
  modeOfDeliverySection: {
    image: {
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
      required: true,
      trim: true
    },
    highlightedText: {
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
elementaryMiddleSchoolPageSchema.index({ is_active: 1 });

export default mongoose.model('ElementaryMiddleSchoolPage', elementaryMiddleSchoolPageSchema);

