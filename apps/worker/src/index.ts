import { Worker } from "bullmq";
import IORedis from "ioredis";
import { client as dbClient } from "@repo/db/client";
import { incrCount, getRedisKey } from "./redis";
const bullmqConnection = new IORedis({ maxRetriesPerRequest: null });

const bookingWorker = new Worker(
  "bookingqueue",
  async (job) => {
    const { data, userId, eventId, paymentId } = job.data;
    console.log("Job data received:", { data, userId, paymentId });
    console.log(typeof paymentId);

    const event = await dbClient.event.findUnique({
      where: {
        id: eventId,
      },
    });

    if (!event || event.startTime < new Date()) {
      throw new Error("Event not found or already started");
    }

    const counter = await incrCount(`booking-${eventId}`);
    console.log(counter);
    const booking = await dbClient.booking.create({
      data: {
        eventId: eventId,
        userId: userId,
        status: "Confirmed",
        paymentId: paymentId,
        sequenceNumber: counter,
        seats: {
          create: data.seats.map((seat: any) => ({
            seatTypeId: seat.id,
            qr: "",
          })),
        },
        expiry: new Date(new Date().getTime() + event.timeoutIns * 1000),
      },
    });
  },
  { connection: bullmqConnection }
);

bookingWorker.on("completed", (job) => {
  console.log(`Job completed with result: ${job}`);
});

bookingWorker.on("failed", (job, err) => {
  console.error(`Job failed with error: ${err}`);
});
