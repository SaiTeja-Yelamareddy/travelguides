const TouristPlace = require('../models/TouristPlace');
const Hotel = require('../models/Hotel');

// @desc    Get all tourist places with search and filter
// @route   GET /places
// @access  Public
const getPlaces = async (req, res) => {
  try {
    const { search, category, city, state, popular } = req.query;
    let query = {};

    if (search && search.trim()) {
      const term = search.trim();
      query.$or = [
        { placeName: { $regex: term, $options: 'i' } },
        { city: { $regex: term, $options: 'i' } },
        { state: { $regex: term, $options: 'i' } },
        { category: { $regex: term, $options: 'i' } },
        { description: { $regex: term, $options: 'i' } }
      ];
    }

    if (category && category.trim() && category !== 'All') {
      query.category = { $regex: `^${category.trim()}$`, $options: 'i' };
    }

    if (city && city.trim() && city !== 'All') {
      query.city = { $regex: `^${city.trim()}$`, $options: 'i' };
    }

    if (state && state.trim() && state !== 'All') {
      query.state = { $regex: `^${state.trim()}$`, $options: 'i' };
    }

    if (popular === 'true') {
      query.isPopular = true;
    }

    const places = await TouristPlace.find(query).sort({ createdAt: -1 });
    res.status(200).json({
      success: true,
      count: places.length,
      data: places
    });
  } catch (error) {
    console.error('Error fetching places:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get single tourist place by placeId or Mongo _id
// @route   GET /places/:id
// @access  Public
const getPlaceById = async (req, res) => {
  try {
    const { id } = req.params;
    let place = await TouristPlace.findOne({ placeId: id });
    if (!place && id.match(/^[0-9a-fA-F]{24}$/)) {
      place = await TouristPlace.findById(id);
    }

    if (!place) {
      return res.status(404).json({ success: false, message: 'Tourist place not found' });
    }

    res.status(200).json({ success: true, data: place });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Create a new tourist place
// @route   POST /places
// @access  Admin only
const createPlace = async (req, res) => {
  try {
    const { placeName, category, city, state, description, visitingHours, imageUrl, isPopular } = req.body;

    if (!placeName || !category || !city || !state || !description || !visitingHours) {
      return res.status(400).json({
        success: false,
        message: 'Please provide all required fields: placeName, category, city, state, description, visitingHours'
      });
    }

    // Generate unique placeId
    const placeId = `PLC_${Date.now()}_${Math.floor(100 + Math.random() * 900)}`;

    const place = await TouristPlace.create({
      placeId,
      placeName: placeName.trim(),
      category: category.trim(),
      city: city.trim(),
      state: state.trim(),
      description: description.trim(),
      visitingHours: visitingHours.trim(),
      imageUrl: imageUrl?.trim() || '',
      isPopular: isPopular === true || isPopular === 'true'
    });

    res.status(201).json({
      success: true,
      message: 'Tourist place created successfully',
      data: place
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Update tourist place
// @route   PUT /places/:id
// @access  Admin only
const updatePlace = async (req, res) => {
  try {
    const { id } = req.params;
    const { placeName, category, city, state, description, visitingHours, imageUrl, isPopular } = req.body;

    let place = await TouristPlace.findOne({ placeId: id });
    if (!place && id.match(/^[0-9a-fA-F]{24}$/)) {
      place = await TouristPlace.findById(id);
    }

    if (!place) {
      return res.status(404).json({ success: false, message: 'Tourist place not found' });
    }

    if (placeName !== undefined) place.placeName = placeName.trim();
    if (category !== undefined) place.category = category.trim();
    if (city !== undefined) place.city = city.trim();
    if (state !== undefined) place.state = state.trim();
    if (description !== undefined) place.description = description.trim();
    if (visitingHours !== undefined) place.visitingHours = visitingHours.trim();
    if (imageUrl !== undefined) place.imageUrl = imageUrl.trim();
    if (isPopular !== undefined) place.isPopular = isPopular === true || isPopular === 'true';

    await place.save();

    res.status(200).json({
      success: true,
      message: 'Tourist place updated successfully',
      data: place
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Delete tourist place
// @route   DELETE /places/:id
// @access  Admin only
const deletePlace = async (req, res) => {
  try {
    const { id } = req.params;
    let place = await TouristPlace.findOne({ placeId: id });
    if (!place && id.match(/^[0-9a-fA-F]{24}$/)) {
      place = await TouristPlace.findById(id);
    }

    if (!place) {
      return res.status(404).json({ success: false, message: 'Tourist place not found' });
    }

    // Delete associated hotels or unlink them
    await Hotel.deleteMany({ placeId: place.placeId });

    await place.deleteOne();

    res.status(200).json({
      success: true,
      message: 'Tourist place and associated hotel records deleted successfully'
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = {
  getPlaces,
  getPlaceById,
  createPlace,
  updatePlace,
  deletePlace
};
