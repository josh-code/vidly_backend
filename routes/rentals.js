const { validate, Rental } = require("../models/rental");
const mongoose = require("mongoose");
const { Customer } = require("../models/customer");
const { Movie } = require("../models/movie");
const Fawn = require("fawn");
const express = require("express");
const router = express.Router();
const auth = require("../middleware/auth");

Fawn.init(mongoose);

router.get("/", async (req, res) => {
  const rentals = await Rental.find().sort("-dateOut");
  res.send(rentals);
});

router.get("/:id", async (req, res) => {
  const rental = await Rental.findById(req.params.id);
  if (!rental) res.status(404).send("Specified rental noe found...");

  res.send(rental);
});

router.post("/", auth, async (req, res) => {
  const { errors } = validate(req.body);
  if (errors) res.status(400).send(errors.details[0].message);

  const customer = await Customer.findById(req.body.customerId);
  if (!customer) res.status(404).send("Customer invalid");

  const movie = await Movie.findById(req.body.movieId);
  if (!movie) res.status(404).send("Movie invalid");

  let rental = Rental({
    customer: {
      _id: customer._id,
      name: customer.name,
      phone: customer.phone
    },
    movie: {
      _id: movie._id,
      title: movie.title,
      dailyRentalRate: movie.dailyRentalRate
    }
  });

  try {
    new Fawn.Task()
      .save("rentals", rental)
      .update(
        "movies",
        { _id: movie._id },
        {
          $inc: { numberInStock: -1 }
        }
      )
      .run();

    res.send(rental);
  } catch (err) {
    res.status(500).send("Something Failed.");
    console.log(err.message);
  }
});

module.exports = router;
