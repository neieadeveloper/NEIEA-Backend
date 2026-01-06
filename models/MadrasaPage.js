import mongoose from "mongoose";

const simpleCardSchema = new mongoose.Schema({
  title: { type: String, required: true, trim: true },
  description: { type: String, required: true, trim: true },
  icon: { type: String, trim: true },
  display_order: { type: Number, default: 0 }
}, { _id: true });

const imageSectionSchema = new mongoose.Schema({
  image: { type: String, trim: true },
  title: { type: String, trim: true },
  description: { type: String, trim: true }
}, { _id: false });

const madrasaPageSchema = new mongoose.Schema({
  heroSection: { title: { type: String, required: true, trim: true }, subtitle: { type: String, trim: true }, description: { type: String, trim: true }, heroImage: { type: String, trim: true } },
  introduction: { heading: { type: String, required: true, trim: true }, description: { type: String, required: true, trim: true } },
  commitmentSection: { heading: { type: String, required: true, trim: true }, description: { type: String, required: true, trim: true }, approachHeading: { type: String, trim: true }, approachText: { type: String, trim: true } },
  objectivesSection: { heading: { type: String, required: true, trim: true }, cards: [simpleCardSchema] },
  featuresSection: { heading: { type: String, required: true, trim: true }, cards: [simpleCardSchema] },
  imageSection1: imageSectionSchema,
  impactSection: { heading: { type: String, required: true, trim: true }, intro: { type: String, trim: true }, cards: [simpleCardSchema] },
  imageSection2: imageSectionSchema,
  challengesSection: { heading: { type: String, required: true, trim: true }, cards: [simpleCardSchema] },
  ctaSection: { heading: { type: String, required: true, trim: true }, description: { type: String, trim: true }, supportText: { type: String, trim: true }, supportLink: { type: String, trim: true }, getInvolvedText: { type: String, trim: true }, getInvolvedLink: { type: String, trim: true } },
  is_active: { type: Boolean, default: true }
}, { timestamps: true });

madrasaPageSchema.index({ is_active: 1 });

export default mongoose.model('MadrasaPage', madrasaPageSchema);


