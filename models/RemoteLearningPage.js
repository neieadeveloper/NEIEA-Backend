import mongoose from "mongoose";

const courseItemSchema = new mongoose.Schema({
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

const pedagogicalApproachItemSchema = new mongoose.Schema({
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

const remoteLearningPageSchema = new mongoose.Schema({
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
    shortDescription: {
      type: String,
      required: false,
      trim: true,
      default: ''
    },
    headerImage: {
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
  coursesOfferedSection: {
    title: {
      type: String,
      required: true,
      trim: true
    },
    courses: [courseItemSchema]
  },
  pedagogicalApproachSection: {
    title: {
      type: String,
      required: true,
      trim: true
    },
    approaches: [pedagogicalApproachItemSchema]
  },
  transformativeLearningSection: {
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
  callToActionSection: {
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
    buttonText: {
      type: String,
      required: true,
      trim: true
    },
    buttonLink: {
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
remoteLearningPageSchema.index({ is_active: 1 });

export default mongoose.model('RemoteLearningPage', remoteLearningPageSchema);
