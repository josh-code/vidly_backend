const mongoose = require("mongoose");
const { genreSchema } = require("../models/genre");
const Joi = require("joi");

const Movie = mongoose.model(
  "Movie",
  mongoose.Schema({
    title: {
      type: String,
      required: true,
      trim: true,
      minLength: 5,
      maxLength: 255
    },
    genre: {
      type: genreSchema,
      required: true
    },
    numberInStock: {
      type: Number,
      required: true,
      min: 0,
      max: 255
    },
    dailyRentalRate: {
      type: Number,
      required: true,
      min: 0,
      max: 255
    }
  })
);

function validate(req) {
  const schema = {
    title: Joi.string()
      .required()
      .min(3),
    genreId: Joi.objectId().required(),
    numberInStock: Joi.number()
      .max(255)
      .min(0),
    dailyRentalRate: Joi.number()
      .max(155)
      .min(0)
  };
  return Joi.validate(req, schema);
}

exports.Movie = Movie;
exports.validate = validate;
//sdsdsdsdsd
