const express = require('express');
const router = express.Router();
const vehicleController = require('../controllers/vehicleController');

// routes for managing vehicles

router.post('/newVehicle', vehicleController.addVehicle);

router.get('/vehicle/:vehicleId', vehicleController.getVehicle);

router.get('/vehicles', vehicleController.getVehicles);

router.get('/vehicleTypes', vehicleController.getVehicleTypes);

router.post('/newVehicleType', vehicleController.addVehicleType);

// router.put('/vehicle/:vehicleId', vehicleController.updateVehicle);

router.delete('/vehicles/:vehicleId', vehicleController.deleteVehicle);

module.exports = router;
