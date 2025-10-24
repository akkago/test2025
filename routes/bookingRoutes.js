const express = require('express');
const router = express.Router();
const BookingController = require('../controllers/bookingController');
const { validateBooking } = require('../middleware/validation');

// POST /api/bookings/reserve
router.post('/reserve', validateBooking, BookingController.reserve);

module.exports = router;
