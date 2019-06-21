const mongoose = require("mongoose");
const Joi = require("joi");

const Customer = new mongoose.model(
  "Customer",
  new mongoose.Schema({
    isGold: { type: Boolean, required: true, default: false },
    name: { type: String, required: true, minLength: 3, maxLength: 225 },
    phone: { type: Number, required: true, minLength: 10, maxLength: 11 }
  })
);

function joiValidation(reqBody) {
  return Joi.validate(reqBody, {
    isGold: Joi.boolean().required(),
    name: Joi.string()
      .required()
      .min(3)
      .max(225),
    phone: Joi.number()
      .required()
      .min(10)
      .max(9999999999)
  });
}

exports.Customer = Customer;
exports.validate = joiValidation;
