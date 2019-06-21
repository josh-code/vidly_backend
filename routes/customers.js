const express = require("express");
const { Customer, validate } = require("../models/customer");
const router = express.Router();
const auth = require("../middleware/auth");

router.get("/", async (req, res) => {
  const customers = await Customer.find();
  res.send(customers);
});

router.get("/:id", async (req, res) => {
  const customer = await Customer.findById(req.params.id);
  if (!customer) return res.status(404).send("Customer does not exist.");
  res.send(customer);
});

router.post("/", async (req, res) => {
  const validation = validate(req.body);
  if (validation.error)
    return res.status(400).send(validation.error.details[0].message);
  const customer = Customer(req.body);

  try {
    const result = await customer.save();
    res.send(result);
  } catch (err) {
    res.status(400).send(err.message);
  }
});

router.put("/:id", auth, async (req, res) => {
  const validation = validate(req.body);
  if (validation.error) return res.status(400).send(error.details[0].message);

  const customer = await Customer.findByIdAndUpdate(req.params.id, req.body, {
    new: true
  });

  if (!customer) res.status(404).send("Specified Customer not found");

  res.send(customer);
});

router.delete("/:id", async (req, res) => {
  const customer = await Customer.deleteOne({ _id: req.params.id });
  if (!customer) res.status(404).send("Specified Customer not found");
  res.send(customer);
});

module.exports = router;
