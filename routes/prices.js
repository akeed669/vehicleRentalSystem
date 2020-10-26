const express = require('express');
const cheerio = require('cheerio');
const _ = require('lodash');
const axios = require('axios');

const router = express.Router();

//URL of website to scrape for pricing records
const URL =
  'https://www.expedia.com/Car-Rentals-In-List.d6209416.Car-Rental-Guide';

//route and method to scrape website
router.get('/', async (req, res) => {
  try {
    const response = await getData();
    return res.send(response);
  } catch (err) {
    console.log(err.message);
    res.status(500).send('Server error');
  }
});

const getData = async () => {
  //get response data from website
  const response = await axios.get(URL);
  //use cheerio load HTML code as a string
  const $ = cheerio.load(response.data);
  //initialise vehicles array
  let vehicles = [];
  //extract the car model as a string; remove other text
  const carmodel = $('.car-model').text().split('or similar');
  const _carmodel = carmodel.map((str) => str.replace(/\s/g, ''));
  //extract the price as a string; remove other text
  const prices = $('.price-and-freshness').text().split('total');
  //clean price strings using regular expressions
  const _prices = prices.map((str) => str.replace(/\s/g, ''));
  let _price = _prices.map((str) => str.replace(/[^\d.-]/g, ''));
  //create an array of objects with car model name and price
  let data = _.zipWith(_carmodel, _price, (_carmodel, _price) => ({
    _carmodel,
    _price
  }));

  //add objects to vehicles array if price string not empty
  data.map((obj) => {
    if (obj._price !== '') {
      vehicles.push(obj);
    }
  });

  return vehicles;
};

module.exports = router;
