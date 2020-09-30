const express = require('express');
const router = express.Router();
const bookingController = require('../controllers/bookingController');
const auth=require("../middleware/auth")

router.post('/booking', bookingController.makeBooking);

router.get('/booking/:bookingId', bookingController.getBooking);

router.get('/bookings', bookingController.getBookings);

router.get('/bookings/user/:userId', bookingController.getUserBookings);
//
router.put('/booking/:bookingId', bookingController.updateBooking);
//
// router.delete('/vehicle/:vehicleId', vehicleController.deleteVehicle);

module.exports = router;
