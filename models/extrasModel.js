const mongoose = require('mongoose');
const Schema = mongoose.Schema;

//create extras schema for mongodb collection

const ExtrasSchema=new mongoose.Schema({

  extraName:{
    type: String,
    required: true
  },

  dailyCost:{
    type: Number,
    required: true
  },

  unitsAvailable:{
    type: Number,
    required: true
  },

});


const Extra = mongoose.model('extra', ExtrasSchema);

module.exports = Extra;
