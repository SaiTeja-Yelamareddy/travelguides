const mongoose = require('mongoose');

const touristPlaceSchema = new mongoose.Schema(
  {
    placeId: {
      type: String,
      required: true,
      unique: true,
      index: true
    },
    placeName: {
      type: String,
      required: [true, 'Please provide place name'],
      trim: true
    },
    category: {
      type: String,
      required: [true, 'Please provide category'],
      trim: true
    },
    city: {
      type: String,
      required: [true, 'Please provide city'],
      trim: true
    },
    state: {
      type: String,
      required: [true, 'Please provide state'],
      trim: true
    },
    description: {
      type: String,
      required: [true, 'Please provide description'],
      trim: true
    },
    visitingHours: {
      type: String,
      required: [true, 'Please provide visiting hours'],
      trim: true
    },
    imageUrl: {
      type: String,
      default: ''
    },
    isPopular: {
      type: Boolean,
      default: false
    }
  },
  {
    timestamps: true
  }
);

// Text search index for efficient searching
touristPlaceSchema.index({
  placeName: 'text',
  city: 'text',
  state: 'text',
  category: 'text'
});

module.exports = mongoose.model('TouristPlace', touristPlaceSchema);
