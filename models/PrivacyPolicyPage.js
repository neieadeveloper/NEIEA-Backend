import mongoose from 'mongoose';

const sectionItemSchema = new mongoose.Schema({
  heading: { type: String, required: true, trim: true },
  subHeading: { type: String, trim: true },
  description: { type: String, trim: true },
  display_order: { type: Number, default: 0 }
}, { _id: true });

const privacyPolicyPageSchema = new mongoose.Schema({
  heroSection: {
    title: { type: String, trim: true },
    subtitle: { type: String, trim: true },
    description: { type: String, trim: true },
    heroImage: { type: String, trim: true }
  },
  sections: [sectionItemSchema],
  is_active: { type: Boolean, default: true }
}, { timestamps: true });

privacyPolicyPageSchema.index({ is_active: 1 });

export default mongoose.model('PrivacyPolicyPage', privacyPolicyPageSchema);


