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
  accessToken: {
    type: String
  }
});

// CustomerSchema.methods.generateAuthToken = function() {
//   const token = jwt.sign({ _id: this._id, role: this.role }, process.env.JWT_SECRET);
//   return token;
// }

CustomerSchema.methods.generateAuthToken = function() {
  const token = jwt.sign({ _id: this._id, name: this.name, username:this.username }, process.env.JWT_SECRET);
  return token;
}

const Customer = mongoose.model('customer', CustomerSchema);

// function validateUserReg(req) {
//   const schema = Joi.object({
//     cname: Joi.string().min(5).max(50).required(),
//     email: Joi.string().min(5).max(255).required().email(),
//     password: Joi.string().min(5).max(255).required()
//   });
//
//   return schema.validate(req);
// }
//
// function validateUserLogin(req) {
//   const schema = Joi.object({
//     email: Joi.string().min(5).max(255).required().email(),
//     password: Joi.string().min(5).max(255).required()
//   });
//
//   return schema.validate(req);
// }

// const AdminSchema = new Schema({
//
//   cname:{
//     type: String,
//     required: true
//   },
//   email: {
//     type: String,
//     required: true,
//     trim: true
//   },
//   password: {
//     type: String,
//     required: true
//   },
//   role: {
//     type: String,
//     default: 'admin'
//   },
//   accessToken: {
//     type: String
//   }
// });

//const Admin = mongoose.model('admin', AdminSchema);


//module.exports = Customer;
// exports.validateReg = validateUserReg
// exports.validateLogin = validateUserLogin
module.exports = mongoose.model('Customer', CustomerSchema);
//module.exports = Admin;
