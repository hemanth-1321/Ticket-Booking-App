import { client } from "@repo/db/client";
import { Request, Response, Router } from "express";
import { adminMiddleware } from "../../../middleware/admin";
import { UpdateSeatSchema } from "../../../types";
const router: Router = Router();
router.put(
  "/:eventId",
  adminMiddleware,
  async (req: Request, res: Response): Promise<void> => {
    try {
      const { data, success } = UpdateSeatSchema.safeParse(req.body);
      const adminId = req.userId;
      const eventId = req.params.eventId ?? "";

      if (!success) {
        res.status(400).json({ message: "Invalid data" });
        return;
      }

      if (!adminId) {
        res.status(401).json({ message: "Unauthorized" });
        return;
      }

      if (!eventId) {
        res.status(400).json({ message: "Invalid event ID" });
        return;
      }

      const event = await client.event.findUnique({
        where: { id: eventId, adminId },
        include: { SeatType: true },
      });

      if (!event) {
        res.status(404).json({ message: "Event not found" });
        return;
      }

      if (event.startTime <= new Date()) {
        res.status(400).json({ message: "Event has already started" });
        return;
      }

      const currentSeats = event.SeatType;

      // Log current seats and request seats for debugging
      console.log("Current Seats:", currentSeats);
      console.log("Request Seats:", data.seats);

      const newSeats = data.seats.filter((x: any) => !x.id);
      const updateSeats = data.seats.filter(
        (x: any) => x.id && currentSeats.some((y: any) => y.id === x.id)
      );
      const deletedSeats = currentSeats.filter(
        (x: any) => !data.seats.some((y: any) => y.id === x.id)
      );

      console.log("New Seats:", newSeats);
      console.log("Update Seats:", updateSeats);
      console.log("Deleted Seats:", deletedSeats);

      // Validate that capacity is not exceeded
      for (const seat of updateSeats) {
        const existingSeat = currentSeats.find((s) => s.id === seat.id);
        if (
          existingSeat &&
          seat.capacity < existingSeat.filled + existingSeat.locked
        ) {
          res.status(400).json({
            message: `SeatType "${seat.name}" capacity cannot be less than booked (${existingSeat.filled}) + locked (${existingSeat.locked})`,
          });
          return;
        }
      }

      await client.$transaction([
        // Delete removed seat types
        client.seatType.deleteMany({
          where: { id: { in: deletedSeats.map((x: any) => x.id) } },
        }),
        // Add new seat types
        client.seatType.createMany({
          data: newSeats.map((x) => ({
            name: x.name,
            description: x.description,
            price: x.price,
            capacity: x.capacity,
            eventId,
            filled: 0, // New seats start empty
            locked: 0,
          })),
        }),
        // Update existing seat types
        ...updateSeats.map((x) =>
          client.seatType.update({
            where: { id: x.id },
            data: {
              name: x.name,
              description: x.description,
              price: x.price,
              capacity: x.capacity,
            },
          })
        ),
      ]);

      // Get updated seat availability
      const updatedSeats = await client.seatType.findMany({
        where: { eventId },
      });
      console.log("Updated Seats:", updatedSeats);

      res.json({
        message: "Seats updated successfully",
        seatAvailability: updatedSeats.map((seat) => ({
          id: seat.id,
          name: seat.name,
          description: seat.description,
          price: seat.price,
          capacity: seat.capacity,
          availableSeats: seat.capacity - (seat.filled + seat.locked),
        })),
      });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Could not update seats" });
    }
  }
);

export default router;
