const { roles } = require('../roles')
const mongoose=require("mongoose")
const Customer= require('../models/userModel');
const Vehicle= require('../models/vehicleModel');
const Rental= require('../models/rentalModel');
const Extra= require('../models/extrasModel');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
let vehicleForBooking=""
require("dotenv").config();

async function hashPassword(password) {
  return await bcrypt.hash(password, 10);
}

async function validatePassword(plainPassword, hashedPassword) {
  return await bcrypt.compare(plainPassword, hashedPassword);
}

//creating an admin
exports.makeadmin = async (req, res, next) =>{
  try{
    const hashedPassword = await hashPassword(process.env.ADMIN_PASS);
    const myAdmin = new Customer({ cname:"admin", email:"admin@z.com", password: hashedPassword, blacklisted:false, repeater:false, dob:"03/25/2015", role:"admin" });
    const accessToken = jwt.sign({ userId: myAdmin._id }, process.env.JWT_SECRET, {
      expiresIn: "1d"
    });
    myAdmin.accessToken = accessToken;
    await myAdmin.save();
    res.send("succesfully created an admin")
  } catch (error) {
    next(error)
  }
}

exports.signup = async (req, res, next) => {
  try {

    const {cname, email, password, blacklisted, repeater,dob, role } = req.body
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
    res.render("login")
  } catch (error) {
    next(error)
  }
}


exports.login = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const user = await Customer.findOne({ email });
    if (!user) return next(new Error('Email does not exist'));
    const validPassword = await validatePassword(password, user.password);
    if (!validPassword) return next(new Error('Password is not correct'))
    const accessToken = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, {
      expiresIn: "1d"
    });
    await Customer.findByIdAndUpdate(user._id, { accessToken })
    if(user.role==="basic"){
      res.render("dashboard",{"currentUser":user})
    }else if(user.role==="admin"){
      res.send("admin")
    }
    // res.status(200).json({
    //   data: { email: user.email, role: user.role },
    //   accessToken
    // })

  } catch (error) {
    next(error);
  }
}

exports.getUsers = async (req, res, next) => {
  const users = await User.find({});
  res.status(200).json({
    data: users
  });
}

exports.getUser = async (req, res, next) => {
  try {
    const userId = req.params.userId;
    const user = await User.findById(userId);
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
    const update = req.body
    const userId = req.params.userId;
    await User.findByIdAndUpdate(userId, update);
    const user = await User.findById(userId)
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
    await User.findByIdAndDelete(userId);
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
}

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

exports.listVehicles = async (req, res, next) => {
  try {
    const vehicles = await Vehicle.find();
    res.render("vehiclelisting",{"allVehicles":vehicles})
  } catch (error) {
    next(error);
  }
}

exports.makeBooking = async (req, res, next) => {
  try {
    //const mycar=req.body;
    //const test2=req.body.extra1;
    const test2=req.body.myextra;
    //const textra=req.body.horse;
    //const addit=e.options[e.selectedIndex].text;
    const isLate=req.body.late;
    let lr=false;
    if(isLate){
      lr=true
    }
    const booking = new Rental({
      vehicle:vehicleForBooking,
      bookingExtra:test2,
      lateReturn:lr
      //customer:req.body.customer,
    });
    console.log(booking.vehicle)
    await booking.save()
    res.send("success")
  } catch (error) {
    next(error);
  }
}

exports.listBookings = async (req, res, next) => {
  try {
    const bookings = await Rental
    .find()
    .populate('vehicle','fuelType')
    res.render("allbookings",{"allBookings":bookings})
  } catch (error) {
    next(error);
  }
}

exports.loginPrompt=async (req, res, next) => {
  try {
    res.render("login")
  } catch (error) {
    next(error);
  }
}

exports.showHome=async (req, res, next) => {
  try {
    res.render("home")
  } catch (error) {
    next(error);
  }
}

exports.configureBooking = async (req, res, next) => {
  try {
    vehicleForBooking=req.body.mycar
    const extraOptions = await Extra.find();
    res.render("booking",{allExtras:extraOptions})
  } catch (error) {
    next(error);
  }
}
