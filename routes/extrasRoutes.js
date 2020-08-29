const express = require('express');
const router = express.Router();
const extrasController = require('../controllers/extrasController');
const auth=require("../middleware/auth")

router.post('/newExtra', extrasController.addExtra);

// router.get('/vehicle/:vehicleId', vehicleController.getVehicle);
//
// router.get('/vehicles', vehicleController.getVehicles);
//
// router.put('/vehicle/:vehicleId', vehicleController.updateVehicle);
//
// router.delete('/vehicle/:vehicleId', vehicleController.deleteVehicle);

module.exports = router;
