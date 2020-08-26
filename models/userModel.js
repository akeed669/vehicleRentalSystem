const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const CustomerSchema = new Schema({

  cname:{
    type: String,
    required: true,
    minlength:5,
    maxlength:50
  },
  email: {
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
    //enum: ["basic", "supervisor", "admin"]
  },
  accessToken: {
    type: String
  }
});

CustomerSchema.methods.generateAuthToken = function() {
  const token = jwt.sign({ _id: this._id, role: this.role }, process.env.JWT_SECRET);
  return token;
}

const Customer = mongoose.model('customer', CustomerSchema);

function validateUser(user) {
  const schema = {
    cname: Joi.string().min(5).max(50).required(),
    email: Joi.string().min(5).max(255).required().email(),
    password: Joi.string().min(5).max(255).required()
  };

  return Joi.validate(user, schema);
}

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


module.exports = Customer;
module.exports.validate=validateUser
//module.exports = Admin;
