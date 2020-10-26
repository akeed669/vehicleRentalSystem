const Joi = require('joi');
const mongoose=require("mongoose")
const Extra= require('../models/extrasModel');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const _ = require('lodash');

//add extra to mongodb collection
exports.addExtra = async (req, res, next) => {
  try {
    //validate received request body
    const { error } = validateExtra(req.body);
    if (error) return res.status(400).send(error.details[0].message);

    //destructure req body and create extra object
    const {extraName, dailyCost, unitsAvailable} = req.body;
    const newExtra = new Extra({ extraName, dailyCost, unitsAvailable });

    //save to collection ; send as response
    await newExtra.save();
    res.json({
      data: newExtra
    })

  } catch (error) {
    next(error)
  }
}

// exports.updateExtra = async (req, res, next) => {
//   try {
//     // const { error } = validateUserReg(req.body);
//     // if (error) return res.status(400).send(error.details[0].message);
//     //const update = req.body
//     //const extraId = req.params.extraId
//     const extrasIds=req.body.unitsAvailable
//     //const vehicleId = vid;
//     //console.log(req.body.vehicle)
//     //const vehicle = await Vehicle.findById(vehicleId)
//     // const update={
//     //   carsAvailable:vehicle.carsAvailable-1
//     // }
//     //const update = req.body
//     const update=
//
//     //console.log(extraId)
//
//     extraId.forEach((item,i) => {
//       Extra.findByIdAndUpdate(item, update);
//     });
//     //await Extra.findByIdAndUpdate(extraId, update);
//     //const extra = await Extra.findById(extraId)
//     // res.status(200).json({
//     //   data: extra,
//     //   message: 'Extra has been updated'
//     // });
//   } catch (error) {
//     next(error)
//   }
// }

//send all extras from mongodb collection as a json response object
//with a status of 200 - success
exports.getExtras = async (req, res, next) => {
  const extras = await Extra.find({});
  res.status(200).json({
    data: extras
  });
}

//get specific extra from mongodb collection; send response as json object
//with a status of 200 - success
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

//delete specific extra from collection; send response
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

//use Joi to validate data received from request when creating a new extra

function validateExtra(req) {
  const schema = Joi.object({
    extraName: Joi.string().min(3).max(50).required(),
    dailyCost: Joi.number().required().integer(),
    unitsAvailable:Joi.number().required().integer()
  });

  return schema.validate(req);
}
