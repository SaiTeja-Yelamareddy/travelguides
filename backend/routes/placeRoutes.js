const express = require('express');
const router = express.Router();
const {
  getPlaces,
  getPlaceById,
  createPlace,
  updatePlace,
  deletePlace
} = require('../controllers/placesController');
const { protect, adminOnly } = require('../middleware/auth');

router.get('/', getPlaces);
router.get('/:id', getPlaceById);
router.post('/', protect, adminOnly, createPlace);
router.put('/:id', protect, adminOnly, updatePlace);
router.delete('/:id', protect, adminOnly, deletePlace);

module.exports = router;
