const Razorpay = require("razorpay");

exports.createOrderId = async (req, res) => {
  const razorpay = new Razorpay({
    key_id: process.env.KEY_ID,
    key_secret: process.env.SECRET_KEY,
  });
  // setting up options for razorpay order.
  const options = {
    amount: 100,
    currency: "INR",
    receipt: "TXN" + Date.now(),
    payment_capture: 1,
  };
  try {
    const response = await razorpay.orders.create(options);
    res.send({
      order_id: response.id,
      currency: response.currency,
      amount: response.amount,
      key_id: process.env.KEY_ID,
    });
  } catch (err) {
    res.status(400).send({
      message: "Not able to create order. Please try again!",
      Error: err,
    });
  }
};

exports.paymentCapture = (req, res) => {
  const { status, orderDetails } = req.body;

  console.log("Payment Status:", status);
  console.log("Order Details:", orderDetails);

  if (status === "succeeded") {
    res.status(200).json({ message: "Payment successful" });
  } else {
    res.status(400).json({ message: "Payment failed or cancelled" });
  }
};
