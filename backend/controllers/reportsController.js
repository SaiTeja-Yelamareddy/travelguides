const TouristPlace = require('../models/TouristPlace');
const Hotel = require('../models/Hotel');
const User = require('../models/User');

// @desc    Get dashboard metrics & counts
// @route   GET /admin/stats
// @access  Admin only
const getAdminStats = async (req, res) => {
  try {
    const totalPlaces = await TouristPlace.countDocuments();
    const totalHotels = await Hotel.countDocuments();
    const totalUsers = await User.countDocuments({ role: 'user' });

    // Recent places
    const recentPlaces = await TouristPlace.find().sort({ createdAt: -1 }).limit(5);

    // Categories breakdown
    const categoryCounts = await TouristPlace.aggregate([
      { $group: { _id: '$category', count: { $sum: 1 } } },
      { $sort: { count: -1 } }
    ]);

    res.status(200).json({
      success: true,
      data: {
        totalPlaces,
        totalHotels,
        totalUsers,
        recentPlaces,
        categoryCounts
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get detailed tourism reports using MongoDB aggregation
// @route   GET /admin/reports
// @access  Admin only
const getTourismReports = async (req, res) => {
  try {
    const totalPlaces = await TouristPlace.countDocuments();
    const totalHotels = await Hotel.countDocuments();

    // 1. Grouped by category
    const byCategory = await TouristPlace.aggregate([
      { $group: { _id: '$category', count: { $sum: 1 } } },
      { $project: { category: '$_id', count: 1, _id: 0 } },
      { $sort: { count: -1 } }
    ]);

    // 2. Grouped by state
    const byState = await TouristPlace.aggregate([
      { $group: { _id: '$state', count: { $sum: 1 } } },
      { $project: { state: '$_id', count: 1, _id: 0 } },
      { $sort: { count: -1 } }
    ]);

    // 3. Grouped by city
    const byCity = await TouristPlace.aggregate([
      { $group: { _id: '$city', count: { $sum: 1 } } },
      { $project: { city: '$_id', count: 1, _id: 0 } },
      { $sort: { count: -1 } }
    ]);

    // 4. Hotels grouped by associated tourist place
    const hotelsByPlace = await Hotel.aggregate([
      { $group: { _id: '$placeId', hotelCount: { $sum: 1 }, avgRating: { $avg: '$rating' }, avgPrice: { $avg: '$roomPrice' } } },
      {
        $lookup: {
          from: 'touristplaces',
          localField: '_id',
          foreignField: 'placeId',
          as: 'place'
        }
      },
      { $unwind: { path: '$place', preserveNullAndEmptyArrays: true } },
      {
        $project: {
          placeId: '$_id',
          placeName: { $ifNull: ['$place.placeName', 'Unknown Place'] },
          city: { $ifNull: ['$place.city', 'N/A'] },
          hotelCount: 1,
          avgRating: { $round: ['$avgRating', 1] },
          avgPrice: { $round: ['$avgPrice', 0] },
          _id: 0
        }
      },
      { $sort: { hotelCount: -1 } }
    ]);

    res.status(200).json({
      success: true,
      data: {
        totalPlaces,
        totalHotels,
        byCategory,
        byState,
        byCity,
        hotelsByPlace
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = {
  getAdminStats,
  getTourismReports
};
