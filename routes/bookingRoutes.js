const express = require("express");
const Booking = require("../models/booking");
const auth = require("../middleware/authMiddleware");
const router = express.Router();

router.post("/", auth, async (req, res) => {
  const booking = await Booking.create({
    ...req.body,
    userId: req.user.id
  });
  res.status(201).json({ message: "Booking confirmed", booking });
});

router.get("/my", auth, async (req, res) => {
  const bookings = await Booking.find({ userId: req.user.id });
  res.json(bookings);
});

module.exports = router;
