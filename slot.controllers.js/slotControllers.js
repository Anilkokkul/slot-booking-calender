const Slots = require("../Model/slot.model");

exports.initializeSlots = async (m, d) => {
  try {
    const month = m;
    const year = 2024;
    const days = d;

    const timeSlots = [
      { start: "10:00", end: "10:45" },
      { start: "11:00", end: "11:45" },
      { start: "14:00", end: "14:45" },
      { start: "15:00", end: "15:45" },
      { start: "16:00", end: "16:45" },
      { start: "17:00", end: "17:45" },
      { start: "18:00", end: "18:45" },
    ];

    for (let day = 1; day <= days; day++) {
      const date = new Date(`${year}-${month}-${day}`);

      for (let timeSlot of timeSlots) {
        slotDate = date;
        const startDateTime = new Date(
          `${date.toISOString().split("T")[0]}T${timeSlot.start}:00.000Z`
        );
        const endDateTime = new Date(
          `${date.toISOString().split("T")[0]}T${timeSlot.end}:00.000Z`
        );
        const slot = new Slots({
          startTime: startDateTime,
          endTime: endDateTime,
        });
        await slot.save();
      }
    }
  } catch (error) {
    console.log(error);
  }
};

exports.getAvailableSlots = async (req, res) => {
  try {
    await Slots.find()
      .then((data) => {
        res.status(200).send({
          message: "Slots Retrieved Successfully",
          Slots: data,
        });
      })
      .catch((error) => {
        res.status(400).send({
          message: "Error while getting slots",
          Error: error.message,
        });
      });
  } catch (error) {
    res.status(400).send({
      message: "Internal server error",
      Error: error,
    });
  }
};

exports.bookingSlot = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, mobileNumber, email, available } = req.body;

    const slot = await Slots.findOne({ _id: id });

    if (!slot) {
      return res.status(404).send({
        message: "No such Slot available",
      });
    }
    if (slot.available === false) {
      return res.status(409).send({
        message: "This slot is not available.",
      });
    }
    await Slots.findByIdAndUpdate(
      { _id: id },
      {
        name,
        mobileNumber,
        email,
        available,
      },
      {
        new: true, //return the updated user instead of original one
      }
    )
      .then((data) => {
        res.status(200).send({
          message: "Slot Booked Successfully",
          slotBooked: data,
        });
      })
      .catch((error) => {
        res.status(400).send({
          message: "Error while booking slot",
          Error: error.message,
        });
      });
  } catch (error) {
    res.status(400).send({
      message: "Internal server error",
      Error: error,
    });
  }
};
