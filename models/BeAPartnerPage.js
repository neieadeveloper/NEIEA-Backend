import mongoose from "mongoose";

const simplePointSchema = new mongoose.Schema({
  title: { type: String, required: true, trim: true },
  description: { type: String, required: true, trim: true },
  display_order: { type: Number, default: 0 }
}, { _id: true });

const beAPartnerPageSchema = new mongoose.Schema({
  heroSection: {
    title: { type: String, required: true, trim: true },
    headerImage: { type: String, trim: true }
  },
  introSection: {
    paragraph1: { type: String, trim: true },
    paragraph2: { type: String, trim: true }
  },
  whySupportSection: {
    heading: { type: String, required: true, trim: true },
    points: [simplePointSchema]
  },
  waysToHelpSection: {
    heading: { type: String, required: true, trim: true },
    points: [simplePointSchema]
  },
  ctaSection: {
    statement: { type: String, trim: true },
    donateLinkText: { type: String, trim: true },
    donateLink: { type: String, trim: true },
    contactEmail: { type: String, trim: true }
  },
  is_active: { type: Boolean, default: true }
}, { timestamps: true });

beAPartnerPageSchema.index({ is_active: 1 });

export default mongoose.model('BeAPartnerPage', beAPartnerPageSchema);


