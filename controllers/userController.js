const Joi = require('joi');
const Customer = require('../models/userModel');
const { roles } = require('../roles')
const {getLicenses} = require('../services/licenseService');
const mongoose=require("mongoose")

const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const _ = require('lodash');

require("dotenv").config();

async function hashPassword(password) {
  return await bcrypt.hash(password, 10);
}

async function validatePassword(plainPassword, hashedPassword) {
  return await bcrypt.compare(plainPassword, hashedPassword);
}

exports.signup = async (req, res, next) => {
  try {

    const { error } = validateUserReg(req.body);

    if (error) return res.status(400).send(error.details[0].message);

    const user = await Customer.findOne({ username: req.body.username });
    if (user) return res.status(400).send('User already registered.');

    const {name, username, password, blacklisted, repeater,role, license, councilTaxId} = req.body

    //check if license is blacklisted
    const {data:licensesArray} = await getLicenses();
    const checkLicense = obj => obj.licensenumber === license;
    if(licensesArray.some(checkLicense)){
      return res.status(400).send("Your license has been blacklisted by the DMV!")
    }

    const dob = new Date(req.body.dob)
    const hashedPassword = await hashPassword(password);
    const newUser = new Customer({ name, username, password: hashedPassword, blacklisted, repeater, role:role||"basic", dob, license, councilTaxId });

    const accessToken = newUser.generateAuthToken();

    newUser.accessToken = accessToken;
    await newUser.save();

    res.header('x-auth-token', accessToken)
    .header("access-control-expose-headers", "x-auth-token")
    .send(_.pick(newUser, ['_id', 'name', 'username', 'role', 'accessToken']));
    //res.render("login")
  } catch (error) {
    next(error)
  }
}

exports.login = async (req, res, next) => {
  try {

    const { error } = validateUserLogin(req.body);
    if (error) {return res.status(400).send(error.details[0].message)};

    const { username, password } = req.body;
    const user = await Customer.findOne({ username });

    if (!user) return next(new Error('Username does not exist'));

    const validPassword = await validatePassword(password, user.password);
    if (!validPassword) return next(new Error('Password is not correct'))

    const accessToken = user.generateAuthToken();

    await Customer.findByIdAndUpdate(user._id, { accessToken });

    res.send(accessToken);

  } catch (error) {
    next(error);
  }
}

exports.getUsers = async (req, res, next) => {
  const users = await Customer.find({});
  res.status(200).json({
    data: users
  });
  // res.send(users);
}

exports.getUser = async (req, res, next) => {
  try {
    const userId = req.params.userId;
    const user = await Customer.findById(userId);
    if (!user) return next(new Error('User does not exist'));
    res.status(200).json({
      data: user
    });
  } catch (error) {
    next(error)
  }
}

exports.updateUser = async (req, res, next) => {
  try {
    // const { error } = validateUserReg(req.body);
    // if (error) return res.status(400).send(error.details[0].message);
    const {repeater:isRepeater, blacklisted:isBlacklisted, name} = req.body;
    const repeater = isRepeater==="Yes"?true:false;
    const blacklisted = isBlacklisted==="Yes"?true:false;

    const update = {repeater, blacklisted, name};
    const userId = req.params.userId;
    await Customer.findByIdAndUpdate(userId, update);
    const user = await Customer.findById(userId)
    res.status(200).json({
      data: user,
      message: 'User has been updated'
    });
  } catch (error) {
    next(error)
  }
}

exports.deleteUser = async (req, res, next) => {
  try {
    const userId = req.params.userId;
    await Customer.findByIdAndDelete(userId);
    res.status(200).json({
      data: null,
      message: 'User has been deleted'
    });
  } catch (error) {
    next(error)
  }
}
// exports.grantAccess = function(action, resource) {
//   return async (req, res, next) => {
//     try {
//       const permission = roles.can(req.user.role)[action](resource);
//       if (!permission.granted) {
//         return res.status(401).json({
//           error: "You don't have enough permission to perform this action"
//         });
//       }
//       next()
//     } catch (error) {
//       next(error)
//     }
//   }
// }//
//
// exports.allowIfLoggedin = async (req, res, next) => {
//   try {
//     const user = res.locals.loggedInUser;
//     if (!user)
//     return res.status(401).json({
//       error: "You need to be logged in to access this route"
//     });
//     req.user = user;
//     next();
//   } catch (error) {
//     next(error);
//   }
// }

// exports.logout = async (req, res, next) => {
//   try {
//     req.logout();
//     //req.flash('success_msg','Now logged out');
//     res.redirect('/login');
//   } catch (error) {
//     next(error);
//   }
// }

// exports.listVehicles = async (req, res, next) => {
//   try {
//     const vehicles = await Vehicle.find();
//     res.render("vehiclelisting",{"allVehicles":vehicles})
//   } catch (error) {
//     next(error);
//   }
// }

function validateUserReg(req) {
  const schema = Joi.object({
    name: Joi.string().min(5).max(50).required(),
    username: Joi.string().min(5).max(255).required().email(),
    password: Joi.string().min(5).max(255).required(),
    role: Joi.string().min(5).max(5),
    dob:Joi.date().less(new Date().toLocaleDateString()),
    license:Joi.string().min(6).max(6).required(),
    councilTaxId:Joi.string().min(6).max(6).required(),
  });

  return schema.validate(req);
}

function validateUserLogin(req) {
  const schema = Joi.object({
    username: Joi.string().min(5).max(255).required().email().label("Username"),
    password: Joi.string().min(5).max(255).required()
  });

  return schema.validate(req);
}
