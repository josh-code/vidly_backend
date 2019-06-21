const auth = require("../middleware/auth");
const express = require("express");
const router = express.Router();
const { Genre } = require("../models/genre");
const { validate: validateReturn, Movie } = require("../models/movie");
const validate = require("../middleware/validate");

router.get("/", async (req, res) => {
  const movies = await Movie.find();
  res.send(movies);
});

router.get("/:id", async (req, res) => {
  const movie = await Movie.findById(req.params.id);
  if (!movie) return res.status(404).send("Movie Not found..");
  res.send(movie);
});

router.post("/", [auth, validate(validateReturn)], async (req, res) => {
  const genre = await Genre.findById(req.body.genreId);
  if (!genre) return res.status(400).send("Genre Invalid..");
  let movie = new Movie({
    title: req.body.title,
    genre: {
      _id: genre._id,
      name: genre.name
    },
    numberInStock: req.body.numberInStock,
    dailyRentalRate: req.body.dailyRentalRate
  });

  try {
    const result = await movie.save();
    res.send(result);
  } catch (error) {
    res.status(400).send("error.message");
  }
});

router.put("/:id", [auth, validate(validateReturn)], async (req, res) => {
  const genre = await Genre.findById(req.body.genreId);
  if (!genre) return res.status(400).send("Genre Invalid..");

  const movie = Movie.findByIdAndUpdate(
    req.params.id,
    {
      title: req.body.title,
      genre: {
        _id: genre._id,
        name: genre.name
      },
      numberInStock: req.body.numberInStock,
      dailyRentalRate: req.body.dailyRentalRate
    },
    { new: true }
  );

  if (!movie)
    return res.status(404).send("The movie with the given Id was not found");

  res.send(movie);
});

router.delete("/:id", auth, async (req, res) => {
  const movie = await Movie.findByIdAndRemove(req.params.id);
  if (!movie)
    return res.status(404).send("The movie with the given ID was not found.");

  res.send(movie);
});

module.exports = router;
