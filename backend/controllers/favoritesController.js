const Favorite = require('../models/Favorite');
const TouristPlace = require('../models/TouristPlace');

// @desc    Get user's favorites
// @route   GET /favorites
// @access  Private (User/Admin)
const getUserFavorites = async (req, res) => {
  try {
    const userId = req.user.userId;
    const favorites = await Favorite.find({ userId }).sort({ createdAt: -1 });

    const placeIds = favorites.map(f => f.placeId);
    const places = await TouristPlace.find({ placeId: { $in: placeIds } });

    res.status(200).json({
      success: true,
      count: places.length,
      data: places,
      favoriteIds: placeIds
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Toggle favorite (add or remove)
// @route   POST /favorites/toggle
// @access  Private
const toggleFavorite = async (req, res) => {
  try {
    const userId = req.user.userId;
    const { placeId } = req.body;

    if (!placeId) {
      return res.status(400).json({ success: false, message: 'Please provide placeId' });
    }

    const existing = await Favorite.findOne({ userId, placeId });
    if (existing) {
      await existing.deleteOne();
      return res.status(200).json({
        success: true,
        favorited: false,
        message: 'Removed from favorites'
      });
    } else {
      await Favorite.create({ userId, placeId });
      return res.status(201).json({
        success: true,
        favorited: true,
        message: 'Saved to favorites'
      });
    }
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Remove favorite by placeId
// @route   DELETE /favorites/:placeId
// @access  Private
const removeFavorite = async (req, res) => {
  try {
    const userId = req.user.userId;
    const { placeId } = req.params;

    const result = await Favorite.findOneAndDelete({ userId, placeId });
    if (!result) {
      return res.status(404).json({ success: false, message: 'Favorite not found' });
    }

    res.status(200).json({
      success: true,
      message: 'Place removed from favorites'
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = {
  getUserFavorites,
  toggleFavorite,
  removeFavorite
};
