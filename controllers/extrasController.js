const Joi = require('joi');
//const Customer = require('../models/userModel');
//const { roles } = require('../roles')
const mongoose=require("mongoose")
//const Vehicle= require('../models/vehicleModel');
//const Rental= require('../models/rentalModel');
const Extra= require('../models/extrasModel');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const _ = require('lodash');

//let vehicleForBooking=""

exports.addExtra = async (req, res, next) => {
  try {
    const { error } = validateExtra(req.body);
    if (error) return res.status(400).send(error.details[0].message);

    const {extraName, dailyCost, unitsAvailable} = req.body
    const newExtra = new Extra({ extraName, dailyCost, unitsAvailable });

    await newExtra.save();
    res.json({
      data: newExtra
    })

  } catch (error) {
    next(error)
  }
}

exports.updateExtra = async (req, res, next) => {
  try {
    // const { error } = validateUserReg(req.body);
    // if (error) return res.status(400).send(error.details[0].message);
    //const update = req.body
    const extraId = req.params.extraId || req.body.extra;
    //const vehicleId = vid;
    //console.log(req.body.vehicle)
    //const vehicle = await Vehicle.findById(vehicleId)
    // const update={
    //   carsAvailable:vehicle.carsAvailable-1
    // }
    const update = req.body

    await Extra.findByIdAndUpdate(extraId, update);
    const extra = await Extra.findById(extraId)
    res.status(200).json({
      data: extra,
      message: 'Extra has been updated'
    });
  } catch (error) {
    next(error)
  }
}

exports.getExtras = async (req, res, next) => {
  const extras = await Extra.find({});
  res.status(200).json({
    data: extras
  });
}

exports.getExtra = async (req, res, next) => {
  try {
    const extraId = req.params.extraId;
    const extra = await Extra.findById(extraId);
    if (!extra) return next(new Error('Extra does not exist'));
    res.status(200).json({
      data: extra
    });
  } catch (error) {
    next(error)
  }
}

exports.deleteExtra = async (req, res, next) => {
  try {
    const extraId = req.params.extraId;
    await Extra.findByIdAndDelete(extraId);
    res.status(200).json({
      data: null,
      message: 'Extra has been deleted'
    });
  } catch (error) {
    next(error)
  }
}


function validateExtra(req) {
  const schema = Joi.object({
    extraName: Joi.string().min(3).max(50).required(),
    dailyCost: Joi.number().required(),
    unitsAvailable:Joi.number().required()
  });

  return schema.validate(req);
}
