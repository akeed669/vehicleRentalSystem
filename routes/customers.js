const express = require('express');
const router = express.Router();

const Customer = require('../model/Client');

//route and method for receiving list of
//fraudulent customers from insurance provider
router.get('/', async (req, res) => {
  try {
    const users = await Customer.list();
    res.json(users);
  } catch (err) {
    console.log(err.message);
    res.status(500).send('Server error');
  }
});
module.exports = router;
