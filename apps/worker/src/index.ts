import { Worker } from "bullmq";
import IORedis from "ioredis";
import { client } from "@repo/db/client";
import { incrCount, getRedisKey } from "./redis";
const connection = new IORedis({ maxRetriesPerRequest: null });

const bookingWorker = new Worker(
  "bookingqueue",
  async (job) => {
    const { data, userId } = job.data;
    console.log(data, userId);

    const event = await client.event.findUnique({
      where: {
        id: data.eventId,
      },
    });

    if (!event || event.startTime < new Date()) {
      throw new Error("Event not found or already started");
    }

    const counter = await incrCount(getRedisKey(`booking-${data.eventId}`));
    const booking = await client.booking.create({
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
  { connection }
);

bookingWorker.on("completed", (job) => {
  console.log(`Job completed with result: ${job.returnvalue}`);
});

bookingWorker.on("failed", (job, err) => {
  console.error(`Job failed with error: ${err}`);
});
