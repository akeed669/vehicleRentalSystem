const axios = require("axios");

exports.getTaxIds = async ()=> {
  const res = await axios.get("http://localhost:5050/api/customers");
  const data = res.data;
  return res;
}
