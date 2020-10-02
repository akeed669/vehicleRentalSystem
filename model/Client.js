const db = require('../database/db');

//create object with method to get a list of records
//from selected table in database
const Client = {
  list: () => {
    return new Promise((resolve, reject) => {
      const query = 'SELECT * FROM customersInsurance';
      db.query(query, null, (err, results) => {
        if (err) {
          return reject(err);
        }
        return resolve(results);
      });
    });
  }
};

module.exports = Client;
