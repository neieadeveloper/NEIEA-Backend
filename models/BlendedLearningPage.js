import mongoose from "mongoose";

const blendedLearningPageSchema = new mongoose.Schema({
  headerSection: {
    title: {
      type: String,
      required: true,
      trim: true
    },
    shortDescription: {
      type: String,
      required: true,
      trim: true
    },
    headerImage: {
      type: String,
      trim: true
    },
    headerVideoUrl: {
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
    },
    supportingImage: {
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
blendedLearningPageSchema.index({ is_active: 1 });

export default mongoose.model('BlendedLearningPage', blendedLearningPageSchema);
