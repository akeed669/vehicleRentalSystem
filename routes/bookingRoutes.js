const express = require('express');
const router = express.Router();
const bookingController = require('../controllers/bookingController');

//routes for managing bookings

router.post('/booking', bookingController.makeBooking);

router.get('/booking/:bookingId', bookingController.getBooking);

router.get('/bookings', bookingController.getBookings);

router.get('/bookings/user/:userId', bookingController.getUserBookings);

// router.put('/booking/:bookingId', bookingController.updateBooking);

router.put('/booking/:bookingId', bookingController.makeBooking);

router.delete('/booking/:bookingId', bookingController.deleteBooking);

module.exports = router;
