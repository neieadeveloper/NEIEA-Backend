import mongoose from "mongoose";

const obeProgramSchema = new mongoose.Schema({
  level: { type: String, required: true, trim: true },
  equivalent: { type: String, required: true, trim: true },
  subjects: [{ type: String, trim: true }],
  icon: { type: String, trim: true },
  display_order: { type: Number, default: 0 },
}, { _id: true });

const subjectSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  display_order: { type: Number, default: 0 },
}, { _id: true });

const galleryImageSchema = new mongoose.Schema({
  image: { type: String, trim: true },
  title: { type: String, trim: true },
  description: { type: String, trim: true },
  display_order: { type: Number, default: 0 },
}, { _id: true });

const impactCardSchema = new mongoose.Schema({
  number: { type: String, trim: true },
  title: { type: String, trim: true },
  description: { type: String, trim: true },
  icon: { type: String, trim: true },
  display_order: { type: Number, default: 0 },
}, { _id: true });

const outOfSchoolDropoutPageSchema = new mongoose.Schema({
  heroSection: {
    title: { type: String, required: true, trim: true },
    subtitle: { type: String, trim: true },
    description: { type: String, trim: true },
    heroImage: { type: String, trim: true },
  },
  objectiveSection: {
    heading: { type: String, required: true, trim: true },
    description: { type: String, required: true, trim: true },
  },
  featuredImageSection: {
    image: { type: String, trim: true },
    caption: { type: String, trim: true },
  },
  obeProgramSection: {
    heading: { type: String, required: true, trim: true },
    description: { type: String, trim: true },
    programs: [obeProgramSchema],
  },
  flexibleNote: {
    text: { type: String, trim: true },
  },
  secondaryProgramSection: {
    heading: { type: String, required: true, trim: true },
    description: { type: String, trim: true },
    subjects: [subjectSchema],
    icon: { type: String, trim: true },
  },
  gallerySection: {
    heading: { type: String, trim: true },
    intro: { type: String, trim: true },
    images: [galleryImageSchema],
  },
  impactSection: {
    heading: { type: String, trim: true },
    intro: { type: String, trim: true },
    cards: [impactCardSchema],
  },
  secondImageSection: {
    image: { type: String, trim: true },
    title: { type: String, trim: true },
    description: { type: String, trim: true },
  },
  is_active: { type: Boolean, default: true },
}, { timestamps: true });

outOfSchoolDropoutPageSchema.index({ is_active: 1 });

export default mongoose.model('OutOfSchoolDropoutPage', outOfSchoolDropoutPageSchema);


