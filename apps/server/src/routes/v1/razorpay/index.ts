import Razorpay from "razorpay";
import express from "express";
import { userMiddleware } from "../../../middleware/user";
import { client } from "@repo/db/client";
const router = express.Router();

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_ID ?? "",
  key_secret: process.env.RAZORPAY_SECRET,
});

console.log(razorpay);

router.post("/create-payement", userMiddleware, async (req, res) => {
  const { amount, eventId } = req.body;
  const userId = req.userId;
  if (!userId) {
    res.status(401).json({
      message: "Unauthorized please login",
    });
    return;
  }
  const event = await client.event.findUnique({
    where: {
      id: eventId,
    },
  });

  if (!event || event.startTime < new Date()) {
    res.status(404).json({
      message: "Event not found or event already started",
    });
    return;
  }
  try {
    const order = await razorpay.orders.create({
      amount: amount * 100, // Convert to paise
      currency: "INR",
      receipt: `order_${eventId}_${userId}`,
      payment_capture: true,
    });
    res.status(200).json({
      orderId: order.id,
      amount: order.amount,
    });
  } catch (error) {
    console.error("Error creating payment", error);
    res.status(500).json({
      message: "Error creating payment",
    });
  }
});
