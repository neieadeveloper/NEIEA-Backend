import mongoose from "mongoose";

const introductionPageSchema = new mongoose.Schema({
  headerSection: {
    title: {
      type: String,
      trim: true,
      default: "Welcome to NEIEA"
    },
    subtitle: {
      type: String,
      trim: true,
      default: "Empowering Education for All"
    }
  },
  aboutSection: {
    heading: {
      type: String,
      trim: true,
      default: "About NEIEA"
    },
    description: {
      type: String,
      trim: true,
      default: "NEIEA is committed to providing quality education and transforming society through innovative learning approaches."
    }
  },
  visionMissionSection: {
    vision: {
      title: {
        type: String,
        required: true,
        trim: true,
        default: "OUR VISION"
      },
      description: {
        type: String,
        required: true,
        trim: true
      }
    },
    mission: {
      title: {
        type: String,
        required: true,
        trim: true,
        default: "OUR MISSION"
      },
      description: {
        type: String,
        required: true,
        trim: true
      }
    }
  },
  keyHighlights: {
    heading: {
      type: String,
      trim: true,
      default: "Key Highlights"
    },
    highlights: [{
      type: String,
      trim: true
    }]
  },
  leadershipMessage: {
    heading: {
      type: String,
      trim: true,
      default: "Leadership Message"
    },
    message: {
      type: String,
      trim: true,
      default: "Our commitment to education excellence drives everything we do."
    },
    author: {
      name: {
        type: String,
        trim: true,
        default: "Leadership Team"
      },
      position: {
        type: String,
        trim: true,
        default: "NEIEA Leadership"
      }
    }
  },
  footerNote: {
    heading: {
      type: String,
      trim: true,
      default: "Registration"
    },
    description: {
      type: String,
      trim: true,
      default: "NEIEA was officially registered on April 18, 2022, as a Section 8a non-profit educational organization in India, after two years of active educational discussions and planning during the Pandemic."
    },
    registrationInfo: {
      type: String,
      trim: true,
      default: "NEIEA has 12a and 80g approvals from the Government of India and also Darpan ID."
    }
  },
  registrationSection: {
    heading: {
      type: String,
      required: true,
      trim: true,
      default: "Registration"
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
  is_active: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true
});

// Index for better performance
introductionPageSchema.index({ is_active: 1 });

export default mongoose.model('IntroductionPage', introductionPageSchema);
