import mongoose from "mongoose";

const benefitItemSchema = new mongoose.Schema({
  icon: { type: String, required: true, trim: true },
  title: { type: String, required: true, trim: true },
  description: { type: String, required: true, trim: true },
  display_order: { type: Number, default: 0 }
}, { _id: true });

const highlightItemSchema = new mongoose.Schema({
  icon: { type: String, required: true, trim: true },
  title: { type: String, required: true, trim: true },
  description: { type: String, required: true, trim: true },
  display_order: { type: Number, default: 0 }
}, { _id: true });

const softSkillTrainingPageSchema = new mongoose.Schema({
  heroSection: {
    title: { type: String, required: true, trim: true },
    subtitle: { type: String, trim: true },
    description: { type: String, trim: true },
    heroImage: { type: String, trim: true }
  },
  introduction: {
    heading: { type: String, required: true, trim: true },
    description: { type: String, required: true, trim: true }
  },
  keyBenefitsSection: {
    heading: { type: String, required: true, trim: true },
    description: { type: String, trim: true },
    benefits: [benefitItemSchema]
  },
  programHighlightsSection: {
    heading: { type: String, required: true, trim: true },
    description: { type: String, trim: true },
    highlights: [highlightItemSchema]
  },
  is_active: { type: Boolean, default: true }
}, { timestamps: true });

softSkillTrainingPageSchema.index({ is_active: 1 });

export default mongoose.model('SoftSkillTrainingPage', softSkillTrainingPageSchema);


