const Hotel = require('../models/Hotel');
const TouristPlace = require('../models/TouristPlace');

// @desc    Get all hotels (optionally filtered by placeId or search)
// @route   GET /hotels
// @access  Public
const getHotels = async (req, res) => {
  try {
    const { placeId, search, minRating, maxPrice } = req.query;
    let query = {};

    if (placeId && placeId.trim()) {
      query.placeId = placeId.trim();
    }

    if (search && search.trim()) {
      query.hotelName = { $regex: search.trim(), $options: 'i' };
    }

    if (minRating) {
      query.rating = { $gte: Number(minRating) };
    }

    if (maxPrice) {
      query.roomPrice = { $lte: Number(maxPrice) };
    }

    const hotels = await Hotel.find(query).sort({ rating: -1, createdAt: -1 });

    // Attach linked tourist place details for rich display
    const placeIds = [...new Set(hotels.map(h => h.placeId))];
    const places = await TouristPlace.find({ placeId: { $in: placeIds } });
    const placeMap = {};
    places.forEach(p => {
      placeMap[p.placeId] = {
        placeName: p.placeName,
        city: p.city,
        state: p.state
      };
    });

    const enrichedHotels = hotels.map(hotel => ({
      ...hotel.toObject(),
      placeDetails: placeMap[hotel.placeId] || null
    }));

    res.status(200).json({
      success: true,
      count: enrichedHotels.length,
      data: enrichedHotels
    });
  } catch (error) {
    console.error('Error fetching hotels:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get single hotel by hotelId or _id
// @route   GET /hotels/:id
// @access  Public
const getHotelById = async (req, res) => {
  try {
    const { id } = req.params;
    let hotel = await Hotel.findOne({ hotelId: id });
    if (!hotel && id.match(/^[0-9a-fA-F]{24}$/)) {
      hotel = await Hotel.findById(id);
    }

    if (!hotel) {
      return res.status(404).json({ success: false, message: 'Hotel not found' });
    }

    const linkedPlace = await TouristPlace.findOne({ placeId: hotel.placeId });

    res.status(200).json({
      success: true,
      data: {
        ...hotel.toObject(),
        placeDetails: linkedPlace ? {
          placeName: linkedPlace.placeName,
          city: linkedPlace.city,
          state: linkedPlace.state
        } : null
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Create a new hotel
// @route   POST /hotels
// @access  Admin only
const createHotel = async (req, res) => {
  try {
    const { hotelName, placeId, address, contactNumber, roomPrice, rating, imageUrl } = req.body;

    if (!hotelName || !placeId || !address || !contactNumber || roomPrice === undefined || rating === undefined) {
      return res.status(400).json({
        success: false,
        message: 'Please provide all required fields: hotelName, placeId, address, contactNumber, roomPrice, rating'
      });
    }

    // Verify linked tourist place exists
    const place = await TouristPlace.findOne({ placeId: placeId.trim() });
    if (!place) {
      return res.status(400).json({
        success: false,
        message: `Linked tourist place with ID "${placeId}" not found`
      });
    }

    const hotelId = `HTL_${Date.now()}_${Math.floor(100 + Math.random() * 900)}`;

    const hotel = await Hotel.create({
      hotelId,
      placeId: placeId.trim(),
      hotelName: hotelName.trim(),
      address: address.trim(),
      contactNumber: contactNumber.trim(),
      roomPrice: Number(roomPrice),
      rating: Number(rating),
      imageUrl: imageUrl ? imageUrl.trim() : ''
    });

    res.status(201).json({
      success: true,
      message: 'Hotel created successfully',
      data: {
        ...hotel.toObject(),
        placeDetails: {
          placeName: place.placeName,
          city: place.city,
          state: place.state
        }
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Update hotel
// @route   PUT /hotels/:id
// @access  Admin only
const updateHotel = async (req, res) => {
  try {
    const { id } = req.params;
    const { hotelName, placeId, address, contactNumber, roomPrice, rating, imageUrl } = req.body;

    let hotel = await Hotel.findOne({ hotelId: id });
    if (!hotel && id.match(/^[0-9a-fA-F]{24}$/)) {
      hotel = await Hotel.findById(id);
    }

    if (!hotel) {
      return res.status(404).json({ success: false, message: 'Hotel not found' });
    }

    if (placeId !== undefined) {
      const place = await TouristPlace.findOne({ placeId: placeId.trim() });
      if (!place) {
        return res.status(400).json({
          success: false,
          message: `Linked tourist place with ID "${placeId}" not found`
        });
      }
      hotel.placeId = placeId.trim();
    }

    if (hotelName !== undefined) hotel.hotelName = hotelName.trim();
    if (address !== undefined) hotel.address = address.trim();
    if (contactNumber !== undefined) hotel.contactNumber = contactNumber.trim();
    if (roomPrice !== undefined) hotel.roomPrice = Number(roomPrice);
    if (rating !== undefined) hotel.rating = Number(rating);
    if (imageUrl !== undefined) hotel.imageUrl = imageUrl.trim();

    await hotel.save();

    res.status(200).json({
      success: true,
      message: 'Hotel updated successfully',
      data: hotel
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Delete hotel
// @route   DELETE /hotels/:id
// @access  Admin only
const deleteHotel = async (req, res) => {
  try {
    const { id } = req.params;
    let hotel = await Hotel.findOne({ hotelId: id });
    if (!hotel && id.match(/^[0-9a-fA-F]{24}$/)) {
      hotel = await Hotel.findById(id);
    }

    if (!hotel) {
      return res.status(404).json({ success: false, message: 'Hotel not found' });
    }

    await hotel.deleteOne();

    res.status(200).json({
      success: true,
      message: 'Hotel record deleted successfully'
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = {
  getHotels,
  getHotelById,
  createHotel,
  updateHotel,
  deleteHotel
};
