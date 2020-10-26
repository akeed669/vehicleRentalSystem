const express = require('express');
const router = express.Router();
const neatCsv = require('neat-csv');
const fs = require('fs');

//route and method to receive list of blacklisted
//license numbers from DMV database
router.get('/', async (req, res) => {
  try {
    //access csv file
    let record_dir = `${__dirname}/../public/records.csv`;
    //read csv file
    fs.readFile(record_dir, async (err, data) => {
      if (err) {
        return res.status(500).send('Server error');
      }
      //parse records in file to an array of objects
      let _records = await neatCsv(data);

      return res.send(_records);
    });
  } catch (err) {
    console.log(err.message);
    res.status(500).send('Server error');
  }
});
module.exports = router;
