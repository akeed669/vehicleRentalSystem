const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');

//route for receiving external prices (web scraping)

router.get('/expedia', userController.getPrices);

// other routes are for managing customers

router.post('/register', userController.signup);

router.post('/login', userController.login);

router.get('/user/:userId', userController.getUser);

router.get('/users', userController.getUsers);

router.put('/user/:userId', userController.updateUser);

router.delete('/user/:userId', userController.deleteUser);

module.exports = router;
