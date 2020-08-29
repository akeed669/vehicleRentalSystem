const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const vehicleController = require('../controllers/vehicleController');
const auth=require("../middleware/auth")

router.get('/login',userController.getLogin)

router.get('/register',userController.getSignup)

//router.get("/makeanewadmin", userController.makeadmin)

router.post('/register', userController.signup);

//router.post('/newVehicle', vehicleController.addVehicle);

//router.post('/login/admin', userController.loginAsAdmin);

router.post('/login', userController.login);

router.get('/user/:userId', userController.getUser);

//router.get('/users',userController.allowIfLoggedin, userController.grantAccess('readAny', 'profile'), userController.getUsers);

router.get('/users', auth, userController.getUsers);

//router.put('/user/:userId', userController.allowIfLoggedin, userController.grantAccess('updateAny', 'profile'), userController.updateUser);
router.put('/user/:userId', userController.updateUser);

//router.delete('/user/:userId', userController.allowIfLoggedin, userController.grantAccess('deleteAny', 'profile'), userController.deleteUser);
router.delete('/user/:userId', userController.deleteUser);

//router.get('/logout', userController.logout);

//router.get('/vehiclelisting', userController.allowIfLoggedin, userController.listVehicles);

//router.get('/allbookings', userController.listBookings);

//router.post('/vehiclelisting', userController.configureBooking);

//router.get('/booking', userController.configureBooking);

//router.post('/booking', userController.makeBooking);

router.get("/", userController.showHome)


module.exports = router;
