import { z } from "zod";

export const CreateBookingSchema = z.object({
  eventId: z.string(),
  seats: z.array(
    z.object({
      id: z.string(),
      qty: z.number(),
    })
  ),
});
