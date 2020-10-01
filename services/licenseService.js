// const http = require('./httpService');
const axios = require("axios");
const apiUrl = require('../config.json');

exports.getLicenses = async ()=> {
  const res = await axios.get("http://localhost:5050/api/records");
  const data = res.data;
  return res;
}
