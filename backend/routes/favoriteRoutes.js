const express = require('express');
const router = express.Router();
const {
  getUserFavorites,
  toggleFavorite,
  removeFavorite
} = require('../controllers/favoritesController');
const { protect } = require('../middleware/auth');

router.get('/', protect, getUserFavorites);
router.post('/toggle', protect, toggleFavorite);
router.delete('/:placeId', protect, removeFavorite);

module.exports = router;
