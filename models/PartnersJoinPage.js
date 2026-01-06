import mongoose from "mongoose";

const partnersJoinPageSchema = new mongoose.Schema(
  {
    headerSection: {
      title: { type: String, required: true, trim: true },
      subtitle: { type: String, required: true, trim: true },
      imageUrl: { type: String, trim: true },
      videoLink: { type: String, trim: true },
    },

    overviewSection: {
      introductionParagraph: { type: String, required: true, trim: true },
      scalableModel: {
        title: { type: String, required: true, trim: true },
        description: { type: String, required: true, trim: true },
      },
      lowCostModelParagraph: { type: String, required: true, trim: true },
      communityPartnerships: {
        title: { type: String, required: true, trim: true },
        description1: { type: String, required: true, trim: true },
        description2: { type: String, required: true, trim: true },
      },
      globalCollaborations: {
        title: { type: String, required: true, trim: true },
        description: { type: String, required: true, trim: true },
      },
      transparencyParagraph: { type: String, required: true, trim: true },
    },

    whyCollaborateSection: {
      title: { type: String, required: true, trim: true },
      points: [
        {
          title: { type: String, required: true, trim: true },
          description: { type: String, required: true, trim: true },
          display_order: { type: Number, default: 0 },
        },
      ],
    },

    howYouCanPartnerSection: {
      title: { type: String, required: true, trim: true },
      modes: [
        {
          title: { type: String, required: true, trim: true },
          description: { type: String, required: true, trim: true },
          display_order: { type: Number, default: 0 },
        },
      ],
    },

    partneringWithCharitiesSection: {
      title: { type: String, required: true, trim: true },
      paragraphs: [{ type: String, required: true, trim: true }],
      imageUrl: { type: String, trim: true },
    },

    callToActionSection: {
      title: { type: String, required: true, trim: true },
      subtitle: { type: String, required: true, trim: true },
      buttonText: { type: String, required: true, trim: true },
      buttonLink: { type: String, required: true, trim: true },
    },

    is_active: { type: Boolean, default: true },
  },
  { timestamps: true }
);

partnersJoinPageSchema.index({ is_active: 1 });

export default mongoose.model("PartnersJoinPage", partnersJoinPageSchema);


