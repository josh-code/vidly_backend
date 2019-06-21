const mongoose = require("mongoose");
const Joi = require("joi");

const genreSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    minLength: 5,
    maxLength: 50
  }
});

const Genre = new mongoose.model("Genre", genreSchema);

function validate(reqBody) {
  return Joi.validate(reqBody, {
    name: Joi.string()
      .min(5)
      .max(50)
      .required()
  });
}

exports.Genre = Genre;
exports.validate = validate;
exports.genreSchema = genreSchema;
