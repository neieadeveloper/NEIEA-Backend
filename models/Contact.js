import mongoose from 'mongoose';

const contactSchema = new mongoose.Schema({
  // Contact Information
  location: {
    type: String,
    required: [true, 'Location is required'],
    trim: true,
    maxlength: [200, 'Location must not exceed 200 characters']
  },
  email: {
    type: String,
    required: [true, 'Email is required'],
    trim: true,
    lowercase: true,
    match: [/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/, 'Please provide a valid email address']
  },
  phone: {
    type: String,
    required: [true, 'Phone number is required'],
    trim: true,
    maxlength: [50, 'Phone number must not exceed 50 characters']
  },
  workingHours: {
    type: String,
    required: [true, 'Working hours is required'],
    trim: true,
    maxlength: [200, 'Working hours must not exceed 200 characters']
  },

  // Mailing Address Section
  organizationName: {
    type: String,
    required: [true, 'Organization name is required'],
    trim: true,
    maxlength: [200, 'Organization name must not exceed 200 characters']
  },
  addressLine1: {
    type: String,
    required: [true, 'Address line 1 is required'],
    trim: true,
    maxlength: [200, 'Address line 1 must not exceed 200 characters']
  },
  addressLine2: {
    type: String,
    trim: true,
    maxlength: [200, 'Address line 2 must not exceed 200 characters']
  },
  city: {
    type: String,
    required: [true, 'City is required'],
    trim: true,
    maxlength: [100, 'City must not exceed 100 characters']
  },
  state: {
    type: String,
    required: [true, 'State is required'],
    trim: true,
    maxlength: [100, 'State must not exceed 100 characters']
  },
  postalCode: {
    type: String,
    required: [true, 'Postal code is required'],
    trim: true,
    maxlength: [20, 'Postal code must not exceed 20 characters']
  },
  country: {
    type: String,
    required: [true, 'Country is required'],
    trim: true,
    maxlength: [100, 'Country must not exceed 100 characters']
  },

  // Status
  is_active: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true
});

// Index for better query performance
contactSchema.index({ is_active: 1 });

const Contact = mongoose.model('Contact', contactSchema);

export default Contact;