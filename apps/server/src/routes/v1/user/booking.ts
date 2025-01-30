import { generateToken } from "authenticator";
import { Router } from "express";
import { client } from "@repo/db/client";
import jwt from "jsonwebtoken";
import { userMiddleware } from "../../../middleware/user";
import { CreateBookingSchema } from "../../../types";
import { getRedisKey, incrCount } from "@repo/reddis/client";
import { date } from "zod";
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
  const { data, success } = CreateBookingSchema.safeParse(req.body);
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

  if (!event || event.startTime > new Date()) {
    res.status(404).json({
      message: "event not found or already started",
    });
    return;
  }
  try {
    const counter = await incrCount(getRedisKey(`booking-${data.eventId}`));
    const booking = await client.booking.create({
      data: {
        eventId: data.eventId,
        userId: userId,
        status: "Pending",
        sequenceNumber: counter,
        seats: {
          create: data.seats.map((seat) => ({
            seatTypeId: seat.id,
            qr: "",
          })),
        },
        expiry: new Date(new Date().getTime() + event.timeoutIns * 1000),
      },
    });
    res.json({
      id: booking.id,
    });
  } catch (error) {
    res.status(500).json({
      message: "Could not create a bookimg",
    });
  }
});

export default router;
