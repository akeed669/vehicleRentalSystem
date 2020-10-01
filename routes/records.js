const express = require('express');
const router = express.Router();
const neatCsv = require('neat-csv');
const fs = require('fs');

router.get('/', async (req, res) => {
  try {
    let record_dir = `${__dirname}/../public/records.csv`;

    fs.readFile(record_dir, async (err, data) => {
      if (err) {
        return res.status(500).send('Server error');
      }
      let _records = await neatCsv(data);

      return res.send(_records);
    });
  } catch (err) {
    console.log(err.message);
    res.status(500).send('Server error');
  }
});
module.exports = router;
