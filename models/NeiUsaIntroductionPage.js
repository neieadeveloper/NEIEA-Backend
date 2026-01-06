import mongoose from "mongoose";

const whoWeServeItemSchema = new mongoose.Schema({
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

const whatWeOfferItemSchema = new mongoose.Schema({
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

const neiUsaIntroductionPageSchema = new mongoose.Schema({
  // Hero Section (from PageTemplate)
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
    }
  },
  // About NEIUSA Section
  aboutSection: {
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
  // Our Vision Section
  visionSection: {
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
    icon: {
      type: String,
      trim: true,
      default: "👁️"
    }
  },
  // Our Mission Section
  missionSection: {
    heading: {
      type: String,
      required: true,
      trim: true
    },
    missionItems: [{
      type: String,
      trim: true
    }],
    icon: {
      type: String,
      trim: true,
      default: "🎯"
    }
  },
  // Who We Serve Section
  whoWeServeSection: {
    heading: {
      type: String,
      required: true,
      trim: true
    },
    description: {
      type: String,
      trim: true
    },
    image: {
      type: String,
      trim: true
    },
    items: [whoWeServeItemSchema]
  },
  // What We Offer Section
  whatWeOfferSection: {
    heading: {
      type: String,
      required: true,
      trim: true
    },
    image: {
      type: String,
      trim: true
    },
    items: [whatWeOfferItemSchema]
  },
  // Join Us Section
  joinUsSection: {
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
      trim: true,
      default: "Get Involved"
    },
    buttonLink: {
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
neiUsaIntroductionPageSchema.index({ is_active: 1 });

export default mongoose.model('NeiUsaIntroductionPage', neiUsaIntroductionPageSchema);

