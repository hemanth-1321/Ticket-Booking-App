import Razorpay from "razorpay";
import express, { Router } from "express";
import { userMiddleware } from "../../../middleware/user";
import { client } from "@repo/db/client";
const router: Router = express.Router();

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_ID ?? "",
  key_secret: process.env.RAZORPAY_SECRET,
});

console.log(razorpay);

router.post("/create-payment", async (req, res) => {
  const { amount, eventId } = req.body;
  console.log(amount, eventId);
  const userId = "185449f2-9177-4077-b632-a37cf5ecf91d";
  console.log(userId);
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

  if (!event) {
    console.log("event not found");
    res.status(404).json({
      message: "Event not found or event already started",
    });
    return;
  }
  try {
    const order = await razorpay.orders.create({
      amount: amount * 100, // Convert to paise
      currency: "INR",
      receipt: "order_" + Date.now(),
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

export default router;
