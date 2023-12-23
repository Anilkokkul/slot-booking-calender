const Slots = require("../Model/slot.model");
const nodemailer = require("nodemailer");

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
        const time = data.startTime;
        const name = data.name;
        const email = data.email;
        sendingConfirmationEmail(name, email, time);
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

async function sendingConfirmationEmail(name, email, time) {
  try {
    const dateTime = new Date(time);
    const options = {
      timeZone: "UTC",
      weekday: "long",
      month: "long",
      day: "numeric",
      year: "numeric",
      hour: "numeric",
      minute: "numeric",
    };
    const formattedDateTime = dateTime.toLocaleString(undefined, options);
    let transporter = await nodemailer.createTransport({
      service: "Gmail",
      auth: {
        user: "anilkokkul8076@gmail.com",
        pass: process.env.PASS,
      },
    });

    let mailoptions = {
      from: "anilkokkul8076@gmail.com",
      to: email,
      subject: "Meeting Confirmation",
      html: `
      <!doctype html>
      <html lang="en-US">
      
      <head>
          <meta content="text/html; charset=utf-8" http-equiv="Content-Type" />
          <title>Reset Password Email Template</title>
          <meta name="description" content="Reset Password Email Template.">
          <style type="text/css">
              a:hover {text-decoration: underline !important;}
          </style>
      </head>
      
      <body marginheight="0" topmargin="0" marginwidth="0" style="margin: 0px; background-color: #f2f3f8;" leftmargin="0">
          <!--100% body table-->
          <p style="font-size: 16px; color: #333; margin-bottom: 10px;">
  Dear ${name},
</p>
<p style="font-size: 14px; color: #555; margin-bottom: 15px;">
  Your meeting on ${formattedDateTime} has been confirmed Successfully.
</p>
<p style="font-size: 14px; color: #555;">
  Thank you for using our slot booking service.
</p>
      </body>
      
      </html>`,
    };

    await transporter.sendMail(mailoptions);
  } catch (error) {
    console.log("Error while sending email: Internal Server Error", error);
  }
}
