import mongoose from "mongoose";

const partneringInstitutionPageSchema = new mongoose.Schema({
  headerSection: {
    title: {
      type: String,
      required: true,
      trim: true
    },
    subtitle: {
      type: String,
      required: true,
      trim: true
    },
    description: {
      type: String,
      required: true,
      trim: true
    },
    imageUrl: {
      type: String,
      trim: true
    },
    heroVideoUrl: {
      type: String,
      trim: true
    }
  },
  overviewSection: {
    title: {
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
  partnershipModelSection: {
    title: {
      type: String,
      required: true,
      trim: true
    },
    contentBlocks: [{
      order: {
        type: Number,
        required: true
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
      }
    }]
  },
  exploreNetworkSection: {
    title: {
      type: String,
      required: true,
      trim: true
    },
    items: [{
      icon: {
        type: String,
        required: true
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
      buttonText: {
        type: String,
        required: true,
        trim: true
      },
      link: {
        type: String,
        required: true,
        trim: true
      },
      display_order: {
        type: Number,
        default: 0
      }
    }]
  },
  callToActionSection: {
    text: {
      type: String,
      required: true,
      trim: true
    },
    description: {
      type: String,
      required: true,
      trim: true
    },
    primaryButtonText: {
      type: String,
      required: true,
      trim: true
    },
    primaryButtonLink: {
      type: String,
      required: true,
      trim: true
    },
    secondaryButtonText: {
      type: String,
      trim: true
    },
    secondaryButtonLink: {
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
partneringInstitutionPageSchema.index({ is_active: 1 });

export default mongoose.model('PartneringInstitutionPage', partneringInstitutionPageSchema);
