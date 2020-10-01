
const axios = require("axios");

exports.getPrices = async ()=> {
  const res = await axios.get("http://localhost:5050/api/prices");
  console.log(res)
  const data = res.data;
  return res;
}
