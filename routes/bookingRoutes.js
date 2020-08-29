const express = require('express');
const router = express.Router();
const bookingController = require('../controllers/bookingController');
const auth=require("../middleware/auth")

router.post('/newBooking', bookingController.makeBooking);

// router.get('/vehicle/:vehicleId', vehicleController.getVehicle);
//
// router.get('/vehicles', vehicleController.getVehicles);
//
// router.put('/vehicle/:vehicleId', vehicleController.updateVehicle);
//
// router.delete('/vehicle/:vehicleId', vehicleController.deleteVehicle);

module.exports = router;
