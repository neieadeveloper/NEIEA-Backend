import mongoose from "mongoose";

// Digital Classroom Tool Schema
const digitalClassroomToolSchema = new mongoose.Schema({
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
  display_order: {
    type: Number,
    default: 0
  }
}, { _id: true });

// Onboarding Step Schema
const onboardingStepSchema = new mongoose.Schema({
  step: {
    type: Number,
    default: 1
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
  display_order: {
    type: Number,
    default: 0
  }
}, { _id: true });

// Digital Tool Schema (for toolbox)
const digitalToolSchema = new mongoose.Schema({
  tool: {
    type: String,
    trim: true,
    default: ''
  },
  purpose: {
    type: String,
    trim: true,
    default: ''
  },
  display_order: {
    type: Number,
    default: 0
  }
}, { _id: true });

// AI Tool Schema
const aiToolSchema = new mongoose.Schema({
  tool: {
    type: String,
    trim: true,
    default: ''
  },
  description: {
    type: String,
    trim: true,
    default: ''
  },
  display_order: {
    type: Number,
    default: 0
  }
}, { _id: true });

// Main Application of Technology Page Schema
const applicationOfTechnologyPageSchema = new mongoose.Schema({
  // Header Section
  headerSection: {
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
    heroVideoUrl: {
      type: String,
      trim: true
    }
  },

  // Digital Classroom Section
  digitalClassroomSection: {
    title: {
      type: String,
      trim: true,
      default: 'What Powers a NEIEA Digital Classroom?'
    },
    description: {
      type: String,
      trim: true,
      default: ''
    },
    image: {
      type: String,
      trim: true
    },
    tools: [digitalClassroomToolSchema],
    summaryText: {
      type: String,
      trim: true,
      default: ''
    }
  },

  // Onboarding Process Section
  onboardingSection: {
    title: {
      type: String,
      trim: true,
      default: 'The NEIEA Onboarding & Enrollment Process'
    },
    description: {
      type: String,
      trim: true,
      default: ''
    },
    image: {
      type: String,
      trim: true
    },
    steps: [onboardingStepSchema]
  },

  // Digital Toolbox Section
  digitalToolboxSection: {
    title: {
      type: String,
      trim: true,
      default: 'NEIEA\'s Digital Toolbox'
    },
    description: {
      type: String,
      trim: true,
      default: ''
    },
    tools: [digitalToolSchema],
    summaryText: {
      type: String,
      trim: true,
      default: ''
    }
  },

  // Hybrid Learning Section
  hybridLearningSection: {
    title: {
      type: String,
      trim: true,
      default: 'Hybrid Classrooms: Onsite + Online Learning'
    },
    description: {
      type: String,
      trim: true,
      default: ''
    },
    onsiteTitle: {
      type: String,
      trim: true,
      default: 'Onsite Classrooms'
    },
    onsiteDescription: {
      type: String,
      trim: true,
      default: ''
    },
    remoteTitle: {
      type: String,
      trim: true,
      default: 'Individual Students via Google Meet'
    },
    remoteDescription: {
      type: String,
      trim: true,
      default: ''
    }
  },

  // Power Backup Section
  powerBackupSection: {
    title: {
      type: String,
      trim: true,
      default: 'Always On: Power Backup for Continuity'
    },
    description: {
      type: String,
      trim: true,
      default: ''
    },
    solutions: {
      type: [String],
      default: ['Uninterruptible Power Supplies (UPS)', 'Inverters', 'Generators (where needed)']
    },
    summaryText: {
      type: String,
      trim: true,
      default: ''
    }
  },

  // AI Integration Section
  aiIntegrationSection: {
    title: {
      type: String,
      trim: true,
      default: 'Using AI to Elevate Learning'
    },
    description: {
      type: String,
      trim: true,
      default: ''
    },
    image: {
      type: String,
      trim: true
    },
    tools: [aiToolSchema],
    summaryText: {
      type: String,
      trim: true,
      default: ''
    }
  },

  // Salesforce CRM Section
  salesforceCRMSection: {
    title: {
      type: String,
      trim: true,
      default: 'Transparent Impact with Salesforce CRM'
    },
    description: {
      type: String,
      trim: true,
      default: ''
    },
    features: {
      type: [{
        icon: String,
        title: String,
        description: String
      }],
      default: [
        {
          icon: '📊',
          title: 'Track Contributions',
          description: 'Track donor contributions and map them directly to student outcomes'
        },
        {
          icon: '🔄',
          title: 'Real-time Updates',
          description: 'Enable real-time updates for donors and parents'
        },
        {
          icon: '💬',
          title: 'Direct Communication',
          description: 'Foster direct communication (when needed) to keep all parties informed and involved'
        }
      ]
    },
    summaryText: {
      type: String,
      trim: true,
      default: ''
    }
  },

  // Mission Statement Section
  missionSection: {
    title: {
      type: String,
      trim: true,
      default: 'Our Mission: Empower Through Access'
    },
    description: {
      type: String,
      trim: true,
      default: ''
    }
  },

  // Call to Action Section
  callToActionSection: {
    title: {
      type: String,
      trim: true,
      default: 'Want to Partner with Us?'
    },
    description: {
      type: String,
      trim: true,
      default: ''
    },
    contactEmail: {
      type: String,
      trim: true,
      default: 'info@neiea.org'
    }
  },

  is_active: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true
});

applicationOfTechnologyPageSchema.index({ is_active: 1 });

export default mongoose.model('ApplicationOfTechnologyPage', applicationOfTechnologyPageSchema);

