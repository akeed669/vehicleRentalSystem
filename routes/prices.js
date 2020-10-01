const express = require('express');
const cheerio = require('cheerio');
const _ = require('lodash');
const axios = require('axios');

const router = express.Router();

const URL =
  'https://www.expedia.com/Car-Rentals-In-List.d6209416.Car-Rental-Guide';

//@route  GET api/rental
//@desc   Scrape date from a website and return
//@access Public
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
  const response = await axios.get(URL);

  const $ = cheerio.load(response.data);
  let vehicles = [];

  const carmodel = $('.car-model').text().split('or similar');
  const _carmodel = carmodel.map((str) => str.replace(/\s/g, ''));

  const prices = $('.price-and-freshness').text().split('total');

  const _prices = prices.map((str) => str.replace(/\s/g, ''));
  let _price = _prices.map((str) => str.replace(/[^\d.-]/g, ''));

  let data = _.zipWith(_carmodel, _price, (_carmodel, _price) => ({
    _carmodel,
    _price
  }));

  data.map((obj) => {
    if (obj._price !== '') {
      vehicles.push(obj);
    }
  });

  return vehicles;
};

module.exports = router;
