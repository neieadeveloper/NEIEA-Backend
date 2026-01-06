import mongoose from 'mongoose';

const socialEmbedSchema = new mongoose.Schema(
  {
    type: {
      type: String,
      required: true,
      enum: ['youtube', 'facebook', 'instagram'],
      trim: true,
      lowercase: true
    },
    url: {
      type: String,
      required: true,
      trim: true
    },
    page: {
      type: String,
      required: true,
      trim: true,
    },
    section: {
      type: String,
      trim: true,
      default: ''
    },
    position: {
      type: Number,
      default: 0
    },
    isActive: {
      type: Boolean,
      default: true
    }
  },
  {
    timestamps: true
  }
);

socialEmbedSchema.index({ page: 1, section: 1, isActive: 1, position: 1 });

export default mongoose.model('SocialEmbed', socialEmbedSchema);
