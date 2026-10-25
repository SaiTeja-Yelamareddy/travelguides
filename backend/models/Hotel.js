const mongoose = require('mongoose');

const hotelSchema = new mongoose.Schema(
  {
    hotelId: {
      type: String,
      required: true,
      unique: true,
      index: true
    },
    placeId: {
      type: String,
      required: [true, 'Please provide linked tourist place ID'],
      index: true
    },
    hotelName: {
      type: String,
      required: [true, 'Please provide hotel name'],
      trim: true
    },
    address: {
      type: String,
      required: [true, 'Please provide address'],
      trim: true
    },
    contactNumber: {
      type: String,
      required: [true, 'Please provide contact number'],
      trim: true
    },
    roomPrice: {
      type: Number,
      required: [true, 'Please provide room price'],
      min: 0
    },
    rating: {
      type: Number,
      required: [true, 'Please provide rating'],
      min: 1,
      max: 5,
      default: 4.0
    },
    imageUrl: {
      type: String,
      trim: true,
      default: ''
    }
  },
  {
    timestamps: true
  }
);

hotelSchema.index({ hotelName: 'text', address: 'text' });

module.exports = mongoose.model('Hotel', hotelSchema);
