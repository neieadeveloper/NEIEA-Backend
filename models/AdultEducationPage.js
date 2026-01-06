import mongoose from 'mongoose';

const featureItemSchema = new mongoose.Schema({
  title: { type: String, required: true, trim: true },
  description: { type: String, required: true, trim: true },
  display_order: { type: Number, default: 0 }
}, { _id: true });

const focusAreaSchema = new mongoose.Schema({
  title: { type: String, required: true, trim: true },
  skills: [{ type: String, trim: true }],
  outcome: { type: String, trim: true },
  display_order: { type: Number, default: 0 }
}, { _id: true });

const adultEducationPageSchema = new mongoose.Schema({
  introduction: {
    title: { type: String, required: true, trim: true },
    subtitle: { type: String, trim: true },
    description: { type: String, required: true, trim: true },
    heroImage: { type: String, trim: true },
    content: { type: String, trim: true }
  },
  whyItMatters: {
    title: { type: String, required: true, trim: true },
    image: { type: String, trim: true },
    content: { type: String, required: true, trim: true }
  },
  learningModel: {
    title: { type: String, required: true, trim: true },
    description: { type: String, trim: true },
    features: [featureItemSchema]
  },
  focusAreas: {
    title: { type: String, required: true, trim: true },
    areas: [focusAreaSchema]
  },
  whyNeiea: {
    title: { type: String, required: true, trim: true },
    benefits: [{ type: String, trim: true }]
  },
  movement: {
    title: { type: String, required: true, trim: true },
    content: { type: String, required: true, trim: true },
    callToAction: { type: String, trim: true }
  },
  is_active: { type: Boolean, default: true }
}, { timestamps: true });

adultEducationPageSchema.index({ is_active: 1 });

export default mongoose.model('AdultEducationPage', adultEducationPageSchema);


