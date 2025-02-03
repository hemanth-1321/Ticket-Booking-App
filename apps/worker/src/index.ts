import { Worker } from "bullmq";
import IORedis from "ioredis";
import { client as dbClient } from "@repo/db/client";
import { incrCount, getRedisKey } from "./redis";
// Initialize Redis client for BullMQ
const bullmqConnection = new IORedis({ maxRetriesPerRequest: null });

const bookingWorker = new Worker(
  "bookingqueue",
  async (job) => {
    const { data, userId } = job.data;
    console.log(data, userId);

    const event = await dbClient.event.findUnique({
      where: {
        id: data.eventId,
      },
    });

    if (!event || event.startTime < new Date()) {
      throw new Error("Event not found or already started");
    }

    const counter = await incrCount(`booking-${data.eventId}`);
    console.log(counter);
    const booking = await dbClient.booking.create({
      data: {
        eventId: data.eventId,
        userId: userId,
        status: "Pending",
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
