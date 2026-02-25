const mongoose = require('mongoose');

const contactSchema = new mongoose.Schema({
  firstName: {
    type: String,
    required: [true, 'Le prénom est requis'],
    trim: true
  },
  lastName: {
    type: String,
    required: [true, 'Le nom est requis'],
    trim: true
  },
  email: {
    type: String,
    required: [true, 'L\'email est requis'],
    trim: true,
    lowercase: true,
    match: [/^\S+@\S+\.\S+$/, 'Veuillez fournir un email valide']
  },
  company: {
    type: String,
    trim: true,
    default: ''
  },
  phone: {
    type: String,
    trim: true,
    default: ''
  },
  subject: {
    type: String,
    required: [true, 'Le sujet est requis']
  },
  formation: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Formation',
    default: null
  },
  message: {
    type: String,
    required: [true, 'Le message est requis']
  },
  status: {
    type: String,
    enum: ['nouveau', 'lu', 'traité'],
    default: 'nouveau'
  },
  reply: {
    type: String,
    default: ''
  },
  repliedAt: {
    type: Date,
    default: null
  }
}, {
  timestamps: true,
  collection: 'demandes'
});

module.exports = mongoose.model('Contact', contactSchema);
