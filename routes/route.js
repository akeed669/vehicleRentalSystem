const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');

router.get("/makeanewadmin", userController.makeadmin)

router.post('/register', userController.signup);

//router.post('/login/admin', userController.loginAsAdmin);

router.post('/login', userController.login);

router.get('/user/:userId', userController.allowIfLoggedin, userController.getUser);

router.get('/users', userController.allowIfLoggedin, userController.grantAccess('readAny', 'profile'), userController.getUsers);

router.put('/user/:userId', userController.allowIfLoggedin, userController.grantAccess('updateAny', 'profile'), userController.updateUser);

router.delete('/user/:userId', userController.allowIfLoggedin, userController.grantAccess('deleteAny', 'profile'), userController.deleteUser);

//router.get('/logout', userController.logout);

router.get('/vehiclelisting', userController.listVehicles);

router.get('/allbookings', userController.listBookings);

router.post('/vehiclelisting', userController.configureBooking);

router.get('/booking', userController.configureBooking);

router.post('/booking', userController.makeBooking);

router.get("/", userController.showHome)

router.get("/login", userController.loginPrompt)


module.exports = router;
