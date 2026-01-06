import mongoose from "mongoose";

const orderedItemSchema = new mongoose.Schema(
  {
    icon: { type: String, trim: true },
    title: { type: String, required: true, trim: true },
    description: { type: String, trim: true },
    image: { type: String, trim: true },
    color: { type: String, trim: true },
    gradient: { type: String, trim: true },
    display_order: { type: Number, default: 0 },
  },
  { _id: true }
);

const testimonialItemSchema = new mongoose.Schema(
  {
    text: { type: String, required: true, trim: true },
    author: { type: String, trim: true },
    role: { type: String, trim: true },
    avatar: { type: String, trim: true },
    display_order: { type: Number, default: 0 },
  },
  { _id: true }
);

const technicalSkillTrainingPageSchema = new mongoose.Schema(
  {
    heroSection: {
      title: { type: String, required: true, trim: true },
      subtitle: { type: String, trim: true },
      description: { type: String, trim: true },
      heroImage: { type: String, trim: true },
    },
    introduction: {
      heading: { type: String, required: true, trim: true },
      description: { type: String, required: true, trim: true },
    },
    solutionSection: {
      heading: { type: String, trim: true },
      description: { type: String, trim: true },
    },
    toolsSection: {
      heading: { type: String, trim: true },
      tools: [{ type: String, trim: true }],
    },
    targetGroupsSection: {
      heading: { type: String, trim: true },
      groups: [orderedItemSchema],
    },
    learningModesSection: {
      heading: { type: String, trim: true },
      description: { type: String, trim: true },
      modes: [orderedItemSchema],
    },
    impactAreasSection: {
      heading: { type: String, trim: true },
      description: { type: String, trim: true },
      areas: [orderedItemSchema],
    },
    testimonialsSection: {
      heading: { type: String, trim: true },
      description: { type: String, trim: true },
      testimonials: [testimonialItemSchema],
    },
    is_active: { type: Boolean, default: true },
  },
  { timestamps: true }
);

technicalSkillTrainingPageSchema.index({ is_active: 1 });

export default mongoose.model(
  "TechnicalSkillTrainingPage",
  technicalSkillTrainingPageSchema
);


