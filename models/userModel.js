const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const Joi = require('joi');
const jwt = require('jsonwebtoken');

//create user schema for mongodb collection
const CustomerSchema = new Schema({

  name:{
    type: String,
    required: true,
    minlength:5,
    maxlength:50
  },
  username: {
    type: String,
    required: true,
    trim: true, //white spaces will be removed from both sides of the string.
    minlength:5,
    maxlength:255,
    unique:true
  },
  password: {
    type: String,
    required: true,
    minlength:6,
    maxlength:1024,
  },
  blacklisted:{
    type: Boolean,
    default: false,
  },
  repeater:{
    type: Boolean,
    default: false,
  },
  dob:{
    type: Date,
    required: true
  },
  role: {
    required: true,
    type: String,
    default: 'basic',
    enum: ["basic", "admin"]
  },
  license:{
    type: String,
    required: true,
    minlength:6,
    maxlength:6
  },
  councilTaxId:{
    type: String,
    required: true,
    minlength:6,
    maxlength:6
  },

  accessToken: {
    type: String
  }
});

//method to generate jwt required when logging in as user
//signed with username, role, name and id ; expires in 24 hours
//encrypted with secret from .env file

CustomerSchema.methods.generateAuthToken = function() {
  const token = jwt.sign({ _id: this._id, name: this.name, username:this.username, role:this.role }, process.env.JWT_SECRET,{
    expiresIn: "1d"
  });
  return token;
}

const Customer = mongoose.model('customer', CustomerSchema);

module.exports = Customer;
