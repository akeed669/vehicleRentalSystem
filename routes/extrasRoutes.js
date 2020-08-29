const express = require('express');
const router = express.Router();
const extrasController = require('../controllers/extrasController');
const auth=require("../middleware/auth")

router.post('/newExtra', extrasController.addExtra);

router.get('/extra/:extraId', extrasController.getExtra);

router.get('/extras', extrasController.getExtras);

router.put('/extra/:extraId', extrasController.updateExtra);

router.delete('/extra/:extraId', extrasController.deleteExtra);

module.exports = router;
