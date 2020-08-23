const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const CustomerSchema = new Schema({

  cname:{
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true,
    trim: true
  },
  password: {
    type: String,
    required: true
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
    //enum: ["basic", "supervisor", "admin"]
  },
  accessToken: {
    type: String
  }
});

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
const Customer = mongoose.model('customer', CustomerSchema);

module.exports = Customer;

//module.exports = Admin;
