const auth = require("../middleware/auth");
const validateObjectId = require("../middleware/validatObjectId");
const admin = require("../middleware/admin");
const express = require("express");
const { Genre, validate: validateReturn } = require("../models/genre");
const router = express.Router();
const validate = require("../middleware/validate");

router.get("/", async (req, res, next) => {
  // throw new Error("Could not get the Genres.");
  const genres = await Genre.find();
  res.send(genres);
});

router.get("/:id", validateObjectId, async (req, res) => {
  const genre = await Genre.findById(req.params.id);
  if (!genre) return res.status(404).send("Specified genre not found");
  res.send(genre);
});

router.post("/", [auth, validate(validateReturn)], async (req, res) => {
  let genre = new Genre(req.body);
  genre = await genre.save();

  res.send(genre);
});

router.put("/:id", [auth, validate(validateReturn)], async (req, res) => {
  const genre = await Genre.findByIdAndUpdate(
    req.params.id,
    {
      $set: req.body
    },
    { new: true }
  );

  if (!genre) return res.status(404).send("Specified genre not found");

  res.send(genre);
});

router.delete("/:id", [auth, admin], async (req, res) => {
  const genre = await Genre.deleteOne({ _id: req.params.id });
  if (!genre) return res.status(404).send("Specified genre not found");

  res.send(genre);
});

module.exports = router;
