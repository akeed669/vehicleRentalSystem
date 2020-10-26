
const axios = require("axios");

exports.getLicenses = async ()=> {
  //call the external DMV server to receive blacklisted customer list
  //received from csv file
  const res = await axios.get("http://localhost:5050/api/records");
  return res;
}
