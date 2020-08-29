const Joi = require('joi');//
//const {Customer, validateReg, validateLogin} = require('../models/userModel');
const Customer = require('../models/userModel');
const { roles } = require('../roles')
const mongoose=require("mongoose")
// const Vehicle= require('../models/vehicleModel');
// const Rental= require('../models/rentalModel');
// const Extra= require('../models/extrasModel');
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

//creating an admin
// exports.makeadmin = async (req, res, next) =>{
//   try{
//     const hashedPassword = await hashPassword(process.env.ADMIN_PASS);
//     const myAdmin = new Customer({ cname:"admin", email:"admin@z.com", password: hashedPassword, blacklisted:false, repeater:false, dob:"03/25/2015", role:"admin" });
//     const accessToken = jwt.sign({ userId: myAdmin._id }, process.env.JWT_SECRET, {
//       expiresIn: "1d"
//     });
//     myAdmin.accessToken = accessToken;
//     await myAdmin.save();
//     res.send("succesfully created an admin")
//   } catch (error) {
//     next(error)
//   }
// }

exports.signup = async (req, res, next) => {
  try {
    const { error } = validateUserReg(req.body);
    if (error) return res.status(400).send(error.details[0].message);

    const user = await Customer.findOne({ email: req.body.email });
    if (user) return res.status(400).send('User already registered.');

    const {cname, email, password, blacklisted, repeater,dob,role } = req.body
    const hashedPassword = await hashPassword(password);
    const newUser = new Customer({ cname, email, password: hashedPassword, blacklisted, repeater, dob, role: role || "basic" });
    const accessToken = jwt.sign({ userId: newUser._id }, process.env.JWT_SECRET, {
      expiresIn: "1d"
    });
    newUser.accessToken = accessToken;
    await newUser.save();
    // res.json({
    //   data: newUser,
    //   accessToken
    // })
    res.header('x-auth-token', accessToken).send(_.pick(newUser, ['_id', 'cname', 'email', 'accessToken']));
    //res.render("login")
  } catch (error) {
    next(error)
  }
}

exports.getLogin= async (req, res, next) => {
  try {
    res.render("login")
  } catch (error) {
    next(error);
  }
}

exports.getSignup= async (req, res, next) => {
  try {
    res.render("register")
  } catch (error) {
    next(error);
  }
}


exports.login = async (req, res, next) => {
  try {
    const { error } = validateUserLogin(req.body);
    if (error) return res.status(400).send(error.details[0].message);

    const { email, password } = req.body;
    const user = await Customer.findOne({ email });
    if (!user) return next(new Error('Email does not exist'));

    const validPassword = await validatePassword(password, user.password);
    if (!validPassword) return next(new Error('Password is not correct'))

    const accessToken = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, {
      expiresIn: "1d"
    });

    //console.log(accessToken)
    await Customer.findByIdAndUpdate(user._id, { accessToken })
    res.header('x-auth-token', accessToken).render("dashboard",{"currentUser":user});
    // if(user.role==="basic"){
    //   res.header('x-auth-token', accessToken).render("dashboard",{"currentUser":user});
    //
    //   //res.render("dashboard",{"currentUser":user})
    // }else if(user.role==="admin"){
    //   res.send("admin")
    // }

    // res.status(200).send({
    //   data: { email: user.email, role: user.role },
    //   accessToken
    // })

  } catch (error) {
    next(error);
  }
}

exports.getUsers = async (req, res, next) => {
  const users = await Customer.find({});
  res.status(200).json({
    data: users
  });
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

    const update = req.body
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
exports.grantAccess = function(action, resource) {
  return async (req, res, next) => {
    try {
      const permission = roles.can(req.user.role)[action](resource);
      if (!permission.granted) {
        return res.status(401).json({
          error: "You don't have enough permission to perform this action"
        });
      }
      next()
    } catch (error) {
      next(error)
    }
  }
}//

exports.allowIfLoggedin = async (req, res, next) => {
  try {
    const user = res.locals.loggedInUser;
    if (!user)
    return res.status(401).json({
      error: "You need to be logged in to access this route"
    });
    req.user = user;
    next();
  } catch (error) {
    next(error);
  }
}

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


exports.showHome=async (req, res, next) => {
  try {
    res.render("home")
  } catch (error) {
    next(error);
  }
}


function validateUserReg(req) {
  const schema = Joi.object({
    cname: Joi.string().min(5).max(50).required(),
    email: Joi.string().min(5).max(255).required().email(),
    password: Joi.string().min(5).max(255).required(),
    role: Joi.string().min(5).max(5)
  });

  return schema.validate(req);
}

function validateUserLogin(req) {
  const schema = Joi.object({
    email: Joi.string().min(5).max(255).required().email(),
    password: Joi.string().min(5).max(255).required()
  });

  return schema.validate(req);
}
