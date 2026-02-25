const mongoose = require('mongoose');

const formationSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Le titre est requis'],
    trim: true
  },
  slug: {
    type: String,
    required: true,
    unique: true,
    lowercase: true
  },
  subtitle: {
    type: String,
    default: ''
  },
  level: {
    number: {
      type: Number,
      required: true,
      min: 1,
      max: 4
    },
    label: {
      type: String,
      required: true
    },
    color: {
      type: String,
      required: true
    }
  },
  public: {
    type: String,
    required: true
  },
  duration: {
    type: String,
    required: true
  },
  prerequisites: {
    type: String,
    default: 'Aucun'
  },
  objectives: [{
    type: String
  }],
  program: [{
    type: String
  }],
  deliverables: [{
    type: String
  }],
  formats: [{
    type: String
  }],
  featured: {
    type: Boolean,
    default: false
  },
  order: {
    type: Number,
    default: 0
  }
}, {
  timestamps: true
});

// Index pour optimiser les recherches par slug et niveau
formationSchema.index({ slug: 1 });
formationSchema.index({ 'level.number': 1 });

module.exports = mongoose.model('Formation', formationSchema);
