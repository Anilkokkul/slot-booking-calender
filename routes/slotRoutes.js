const express = require("express");
const {
  initializeSlots,
  getAvailableSlots,
  bookingSlot,
} = require("../slot.controllers.js/slotControllers");
const {
  createOrderId,
  paymentCapture,
} = require("../slot.controllers.js/payment.controllers");

const router = express.Router();

router.get("/create/slots", async (req, res) => {
  try {
    const { month, days } = req.body;
    await initializeSlots(month, days);
    res
      .status(201)
      .json({ message: "Slot creation process has been initialized" });
  } catch (error) {
    res.status(400).send({
      message: "Internal server error",
      Error: error,
    });
  }
});

router.get("/slots", getAvailableSlots);

router.put("/slot/booking/:id", bookingSlot);

router.post("/order", createOrderId);

//to update payment details in database for now we just consoling them
router.post("/payment", paymentCapture);

module.exports = router;
