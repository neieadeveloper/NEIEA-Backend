import mongoose from "mongoose";

const listItemSchema = new mongoose.Schema({
  title: { type: String, required: true, trim: true },
  description: { type: String, trim: true },
  icon: { type: String, trim: true },
  duration: { type: String, trim: true },
  level: { type: String, trim: true },
  modules: [{ type: String, trim: true }],
  features: [{ type: String, trim: true }],
  display_order: { type: Number, default: 0 }
}, { _id: true });

const imageSectionSchema = new mongoose.Schema({
  image: { type: String, trim: true },
  title: { type: String, trim: true },
  description: { type: String, trim: true }
}, { _id: false });

const teachersTrainingPageSchema = new mongoose.Schema({
  heroSection: { title: { type: String, required: true, trim: true }, subtitle: { type: String, trim: true }, description: { type: String, trim: true }, heroImage: { type: String, trim: true }, videoLink: { type: String, trim: true } },
  missionSection: { heading: { type: String, required: true, trim: true }, description: { type: String, required: true, trim: true } },
  trainingPathwaysSection: { heading: { type: String, required: true, trim: true }, intro: { type: String, trim: true }, items: [listItemSchema] },
  coreComponentsSection: { heading: { type: String, required: true, trim: true }, intro: { type: String, trim: true }, items: [listItemSchema] },
  skillsGainedSection: { heading: { type: String, required: true, trim: true }, intro: { type: String, trim: true }, items: [listItemSchema] },
  whyChooseUsSection: { heading: { type: String, required: true, trim: true }, intro: { type: String, trim: true }, items: [listItemSchema] },
  imageSection: imageSectionSchema,
  ctaSection: { heading: { type: String, required: true, trim: true }, description: { type: String, trim: true } },
  is_active: { type: Boolean, default: true }
}, { timestamps: true });

teachersTrainingPageSchema.index({ is_active: 1 });

export default mongoose.model('TeachersTrainingPage', teachersTrainingPageSchema);


