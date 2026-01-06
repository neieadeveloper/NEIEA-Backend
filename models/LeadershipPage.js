import mongoose from "mongoose";

const leadershipPageSchema = new mongoose.Schema({
  heroSection: {
    title: {
      type: String,
      required: true,
      trim: true,
      default: "Meet Our Team"
    },
    description: {
      type: String,
      required: true,
      trim: true,
      default: "Meet our team of dedicated leaders at NEIEA, a passionate group committed to empowering communities through innovative education and skill-building programs. With diverse backgrounds in teaching, administration, technology, and outreach, our team brings extensive experience and vision to every project."
    },
    heroImage: {
      type: String,
      required: true,
      trim: true,
      default: "/assets/images/banner-2.png"
    }
  },
  is_active: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true
});

leadershipPageSchema.index({ is_active: 1 });

export default mongoose.model('LeadershipPage', leadershipPageSchema);

