import { generateToken } from "authenticator";
import { Router } from "express";
import { client } from "@repo/db/client";
import jwt from "jsonwebtoken";
import { userMiddleware } from "../../../middleware/user";
import { CreateBookingSchema } from "../../../types";
import { Queue } from "bullmq";
import { VerifyPayments } from "../../../utils/paymentUtils";
const router: Router = Router();

router.get("/", userMiddleware, async (req, res) => {
  const bookings = await client.booking.findMany({
    where: {
      userId: req.userId,
    },
  });
  res.status(200).json({
    bookings,
  });
});

router.post("/", userMiddleware, async (req, res) => {
  const bookingQueue = new Queue("bookingqueue");
  const { data, success } = CreateBookingSchema.safeParse(req.body);
  const { orderId, payementId, signature, eventId } = req.body;
  console.log(orderId, payementId, signature, eventId);

  const userId = req.userId;
  if (!success) {
    res.status(400).json({
      message: "Invalid data",
    });
    return;
  }
  if (!userId) {
    res.status(401).json({
      message: "Unauthorized",
    });
    return;
  }

  const event = await client.event.findUnique({
    where: {
      id: data.eventId,
    },
  });
  console.log(event);

  if (!event || event.startTime < new Date()) {
    res.status(404).json({
      message: "event not found or already started",
    });
    return;
  }

  const isValid = VerifyPayments(orderId, payementId, signature);
  if (!isValid) {
    res.status(401).json({
      message: "Payment verification Failed",
    });
  }
  try {
    await bookingQueue.add("createBooking", { data, userId, eventId });
    res.json({
      message: "payment sucessfull, Booking in proceess",
      payementId,
    });
  } catch (error) {
    console.error("Booking queue error:", error);
    res.status(500).json({ message: "Payment successful, but booking failed" });
  }
});

export default router;
