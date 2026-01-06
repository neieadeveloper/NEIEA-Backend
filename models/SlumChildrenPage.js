import mongoose from "mongoose";

const programFeatureSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true
  },
  level: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    required: true,
    trim: true
  },
  modules: [{
    type: String,
    trim: true
  }],
  outcome: {
    type: String,
    required: true,
    trim: true
  },
  display_order: {
    type: Number,
    default: 0
  }
}, { _id: true });

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

const partnershipSchema = new mongoose.Schema({
  icon: {
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
  tags: [{
    type: String,
    trim: true
  }],
  display_order: {
    type: Number,
    default: 0
  }
}, { _id: true });

const successOutcomeSchema = new mongoose.Schema({
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

const approachItemSchema = new mongoose.Schema({
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

const slumChildrenPageSchema = new mongoose.Schema({
  // Introduction Section
  introduction: {
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
      required: true,
      trim: true
    },
    heroImage: {
      type: String,
      trim: true
    }
  },
  // Program Features Section
  programFeaturesSection: {
    heading: {
      type: String,
      required: true,
      trim: true
    },
    features: [programFeatureSchema]
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
  // Partnership Impact Section
  partnershipSection: {
    heading: {
      type: String,
      required: true,
      trim: true
    },
    partnerships: [partnershipSchema]
  },
  // Success Outcomes Section
  successOutcomesSection: {
    heading: {
      type: String,
      required: true,
      trim: true
    },
    outcomes: [successOutcomeSchema]
  },
  // Why Our Approach Works Section
  approachSection: {
    heading: {
      type: String,
      required: true,
      trim: true
    },
    items: [approachItemSchema]
  },
  // Mission Statement Section
  missionStatement: {
    text: {
      type: String,
      required: true,
      trim: true
    }
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
      required: true,
      trim: true
    },
    contactLink: {
      type: String,
      trim: true
    },
    donateLink: {
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
slumChildrenPageSchema.index({ is_active: 1 });

export default mongoose.model('SlumChildrenPage', slumChildrenPageSchema);

