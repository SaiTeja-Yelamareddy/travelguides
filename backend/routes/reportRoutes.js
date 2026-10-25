const express = require('express');
const router = express.Router();
const { getAdminStats, getTourismReports } = require('../controllers/reportsController');
const { protect, adminOnly } = require('../middleware/auth');

router.get('/stats', protect, adminOnly, getAdminStats);
router.get('/reports', protect, adminOnly, getTourismReports);

module.exports = router;
