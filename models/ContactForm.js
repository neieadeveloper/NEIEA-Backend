import mongoose from 'mongoose';

const contactFormSchema = new mongoose.Schema({
  // Contact Form Fields
  name: {
    type: String,
    required: [true, 'Name is required'],
    trim: true,
    maxlength: [100, 'Name must not exceed 100 characters']
  },
  email: {
    type: String,
    required: [true, 'Email is required'],
    trim: true,
    lowercase: true,
    match: [/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/, 'Please provide a valid email address']
  },
  affiliation: {
    type: String,
    trim: true,
    maxlength: [200, 'Affiliation must not exceed 200 characters'],
    default: ''
  },
  inquiryType: {
    type: String,
    required: [true, 'Inquiry type is required'],
    trim: true,
    enum: ['Press', 'Donation', 'Partnership', 'Membership', 'Feedback', 'Other'],
    maxlength: [50, 'Inquiry type must not exceed 50 characters']
  },
  message: {
    type: String,
    required: [true, 'Message is required'],
    trim: true,
    maxlength: [1000, 'Message must not exceed 1000 characters']
  },

  // Status
  status: {
    type: String,
    enum: ['new', 'read', 'replied', 'closed'],
    default: 'new'
  },
  notes: {
    type: String,
    trim: true,
    maxlength: [1000, 'Notes must not exceed 1000 characters'],
    default: ''
  },
  is_active: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true
});

// Index for better query performance
contactFormSchema.index({ email: 1 });
contactFormSchema.index({ inquiryType: 1 });
contactFormSchema.index({ status: 1 });
contactFormSchema.index({ createdAt: -1 });

const ContactForm = mongoose.model('ContactForm', contactFormSchema);

export default ContactForm;
