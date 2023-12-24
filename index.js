const express = require("express");
const { db } = require("./DB/db.connect");
const cors = require("cors");
const slotRoutes = require("./routes/slotRoutes");
const app = express();
require("dotenv").config();

const {
  createOrderId,
  paymentCapture,
} = require("./slot.controllers.js/payment.controllers");
db();
const corsOptions = {
  origin: [
    "http://localhost:3000",
    "https://brilliant-salmiakki-fae0bf.netlify.app",
  ],
  credentials: true,
  methods: ["GET", "POST", "DELETE", "PUT"],
};
app.use(cors(corsOptions));
app.use(express.json());
app.use(slotRoutes);

app.post("/order", createOrderId);

//to update payment details in database for now we just consoling them
app.post("/payment", paymentCapture);

const port = 8000;

app.get("/", (req, res) => {
  res.send(`<h1>Hello World! Welcome to slot booking API!</h1>`);
});

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
