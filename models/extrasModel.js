const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const ExtrasSchema=new mongoose.Schema({

  extraName:{
    type: String,
    required: true
  },
  // dailyCost:{
  //   type: Number,
  //   required: true
  // },
  // available:{
  //   type: Boolean,
  //   required: true
  // },

});


const Extra = mongoose.model('extra', ExtrasSchema);

module.exports = Extra;
module.exports.eSchema = ExtrasSchema;
//admin should be able to add more extras
