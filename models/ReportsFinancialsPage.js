import mongoose from 'mongoose';

const keyHighlightSchema = new mongoose.Schema({
  _id: { type: mongoose.Schema.Types.ObjectId, auto: true },
  icon: { type: String, trim: true, default: '' },
  title: { type: String, trim: true, default: '' },
  description: { type: String, trim: true, default: '' },
  color: { type: String, trim: true, default: '' },
  display_order: { type: Number, default: 0 }
}, { _id: false });

const reportsFinancialsPageSchema = new mongoose.Schema({
  headerSection: {
    title: { type: String, required: true, trim: true },
    subtitle: { type: String, trim: true, default: '' },
    description: { type: String, trim: true, default: '' },
    heroImage: { type: String, trim: true, default: '' }
  },
  missionSection: {
    title: { type: String, trim: true, default: '' },
    description: { type: String, trim: true, default: '' }
  },
  keyHighlightsSection: {
    sectionLabel: { type: String, trim: true, default: 'KEY HIGHLIGHTS' },
    title: { type: String, trim: true, default: 'Our Impact Areas' },
    description: { type: String, trim: true, default: '' },
    highlights: [keyHighlightSchema]
  },
  impactReportSection: {
    title: { type: String, trim: true, default: '' },
    description: { type: String, trim: true, default: '' },
    pdfUrl: { type: String, trim: true, default: '' },
    buttonText: { type: String, trim: true, default: '📥 Read Complete Report' }
  },
  is_active: { type: Boolean, default: true }
}, { timestamps: true });

const ReportsFinancialsPage = mongoose.model('ReportsFinancialsPage', reportsFinancialsPageSchema);
export default ReportsFinancialsPage;
