import mongoose from 'mongoose';

const iconCardSchema = new mongoose.Schema({
  title: { type: String, required: true, trim: true },
  description: { type: String, required: true, trim: true },
  icon: { type: String, trim: true },
  display_order: { type: Number, default: 0 }
}, { _id: true });

const GlobalEducationPageSchema = new mongoose.Schema({
  heroSection: {
    title: { type: String, trim: true },
    subtitle: { type: String, trim: true },
    description: { type: String, trim: true },
    heroImage: { type: String, trim: true }
  },
  introduction: {
    heading: { type: String, required: true, trim: true },
    description: { type: String, required: true, trim: true }
  },
  missionSection: {
    heading: { type: String, required: true, trim: true },
    description: { type: String, required: true, trim: true },
    image: { type: String, trim: true }
  },
  sdgSection: {
    heading: { type: String, required: true, trim: true },
    description: { type: String, required: true, trim: true }
  },
  sdgFocusSection: {
    heading: { type: String, required: true, trim: true },
    description: { type: String, required: true, trim: true },
    contributions: [iconCardSchema]
  },
  equityImpactSection: {
    heading: { type: String, required: true, trim: true },
    paragraphs: [{ type: String, trim: true }],
    image: { type: String, trim: true }
  },
  bannerImage: { type: String, trim: true },
  valuesIntroSection: {
    heading: { type: String, required: true, trim: true },
    description: { type: String, required: true, trim: true }
  },
  valuesList: [iconCardSchema],
  valuesSummary: { type: String, trim: true },
  is_active: { type: Boolean, default: true }
}, { timestamps: true });

GlobalEducationPageSchema.index({ is_active: 1 });

export default mongoose.model('GlobalEducationPage', GlobalEducationPageSchema);


