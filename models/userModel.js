const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const Joi = require('joi');
const jwt = require('jsonwebtoken');

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
    //enum: [true,false]
  },
  repeater:{
    type: Boolean,
    default: false,
    //enum: [true,false]
  },
  dob:{
    type: Date,
    required: true
  },
  role: {
    type: String,
    default: 'basic',
    enum: ["basic", "admin"]
  },
  accessToken: {
    type: String
  }
});

CustomerSchema.methods.generateAuthToken = function() {
  const token = jwt.sign({ _id: this._id, name: this.name, username:this.username, role:this.role }, process.env.JWT_SECRET,{
    expiresIn: "1d"
  });
  return token;
}

const Customer = mongoose.model('customer', CustomerSchema);

module.exports = mongoose.model('Customer', CustomerSchema);
