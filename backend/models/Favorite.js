const mongoose = require('mongoose');

// Dedicated Favorites collection to persist user saved tourist destinations cleanly
const favoriteSchema = new mongoose.Schema(
  {
    userId: {
      type: String,
      required: true,
      index: true
    },
    placeId: {
      type: String,
      required: true,
      index: true
    }
  },
  {
    timestamps: true
  }
);

// Ensure a user cannot duplicate favorite the same place
favoriteSchema.index({ userId: 1, placeId: 1 }, { unique: true });

module.exports = mongoose.model('Favorite', favoriteSchema);
