
const axios = require("axios");

exports.getPrices = async ()=> {
  //call the external car rental website server to receive price list
  //received from real time website via web scraping
  const res = await axios.get("http://localhost:5050/api/prices");
  return res;
}
