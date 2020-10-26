const axios = require("axios");

exports.getTaxIds = async ()=> {
  //call the external insurance server to receive fraudulent customer list
  //received from mysql database
  const res = await axios.get("http://localhost:5050/api/customers");
  return res;
}
