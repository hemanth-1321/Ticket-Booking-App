import { client } from "@repo/db/client";
import { Router } from "express";
import { Request, Response } from "express";
import { adminMiddleware } from "../../../middleware/admin";
import {
  CreateEventSchema,
  UpdateEventSchema,
  UpdateSeatSchema,
} from "../../../types";
import { getEvent } from "../../../controllers/events";
import { getPresignedUrl } from "../../../utils/S3";
const router: Router = Router();

router.post("/event/presigned-url", async (req, res) => {
  console.log(req.body);
  const { fileName, fileType } = req.body;
  console.log(fileName, fileType);
  if (!fileName || !fileType) {
    res.status(400).json({
      message: "Missing FileName or FileType",
    });
    return;
  }
  try {
    const { uploadURL, filePath } = await getPresignedUrl(
      fileName as string,
      fileType as string,
      "locations"
    );
    console.log(uploadURL, filePath);
    res.status(200).json({ uploadURL, filePath });
  } catch (error) {
    console.error("error uploading image", error);
    res.status(500).json({
      message: "Error uploading Image",
    });
  }
});

router.post("/image-upload", adminMiddleware, async (req, res) => {
  const { image_path } = req.body;
  const id = req.userId;
  if (!image_path) {
    res.status(400).json({
      message: "Image not found",
    });
    return;
  }
  try {
    const uploadImage = await client.event.update({
      where: {
        adminId: id,
      },
      data: {
        imageUrl: image_path,
      },
    });
    res.status(201).json({
      message: "Image uploaded SucessFully",
    });
  } catch (error) {
    console.log("error uploading image ");
    res.status(500).json({
      message: "Error uploading image",
    });
  }
});
router.post("/", adminMiddleware, async (req, res) => {
  const { data, success, error } = CreateEventSchema.safeParse(req.body);
  console.log(req.body);

  const adminId = req.userId;
  // console.log("Validation Success:", success);
  // console.log("Parsed Data:", data);
  // console.log("Validation Errors:", error);

  if (!adminId) {
    res.status(401).json({
      messsage: "Unauthorized",
    });

    return;
  }
  if (!success) {
    res.status(400).json({
      message: "Invalid data",
    });
    return;
  }
  const startTimeISO = new Date(data.startTime);
  try {
    const event = await client.event.create({
      data: {
        name: data.name,
        description: data.description,
        startTime: startTimeISO,
        location: data.location,
        adminId,
      },
    });
    console.log("event", event);
    res.status(201).json({ event });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      message: "Could not create event",
      error,
    });
  }
});

router.put("/metadata/:eventId", adminMiddleware, async (req, res) => {
  const { data, success } = UpdateEventSchema.safeParse(req.body);
  const adminId = req.userId;
  const eventId = req.params.eventId ?? "";
  if (!adminId) {
    res.status(401).json({
      message: "Unauthorized",
    });
    return;
  }
  if (!success) {
    res.status(400).json({
      message: "Invalid data",
    });
    return;
  }

  try {
    const event = await client.event.findUnique({
      where: {
        id: eventId,
      },
    });

    if (!event || event.adminId !== adminId) {
      res.status(404).json({
        message: "Cant update event",
      });
    }
    const updatedEvent = await client.event.update({
      where: {
        id: eventId,
      },

      data: {
        name: data.name,
        description: data.description,
        startTime: data.startTime,
        location: data.location,
        banner: data.banner,
        adminId,
        published: data.published,
        ended: data.ended,
      },
    });
    res.json({
      updatedEvent,
    });
  } catch (error) {
    res.json(500).json({
      message: "Could not found event",
    });
  }
});

router.get("/", adminMiddleware, async (req, res) => {
  const events = await client.event.findMany({
    where: {
      adminId: req.userId,
    },
    include: {
      SeatType: true,
    },
  });
  res.json({
    events,
  });
});

router.get("/:eventId", adminMiddleware, async (req, res) => {
  const adminId = req.userId;
  const event = await getEvent(req.params.eventId ?? "", adminId);
  if (!event) {
    res.status(404).json({ message: "Event Not found" });
    return;
  }
  res.json({ event });
});

router.put(
  "/seats/:eventId",
  adminMiddleware,
  async (req: Request, res: Response): Promise<void> => {
    try {
      const { data, success } = UpdateSeatSchema.safeParse(req.body);
      const adminId = req.userId;
      const eventId = req.params.eventId ?? "";

      if (!success) {
        res.status(400).json({
          message: "Invalid data",
        });
        return;
      }

      if (!adminId) {
        res.status(402).json({
          message: "Unauthorized",
        });
        return;
      }

      if (!eventId) {
        res.status(400).json({
          message: "Invalid data",
        });
        return;
      }

      const event = await client.event.findUnique({
        where: {
          id: eventId,
          adminId,
        },
      });

      if (!event || event.startTime <= new Date() || adminId !== adminId) {
        console.log(event, event?.startTime, new Date(), adminId);
        res.status(404).json({
          message: "Event not found or Event already started",
        });
        return;
      }

      const currentSeats = await client.seatType.findMany({
        where: {
          eventId: eventId,
        },
      });

      const newSeats = data.seats.filter((x) => !x.id);
      const updateSeats = data.seats.filter(
        (x) => x.id && currentSeats.find((y: any) => y.id === x.id)
      );
      const deletedSeats = currentSeats.filter(
        (x: any) => !data.seats.find((y) => y.id === x.id)
      );

      await client.$transaction([
        client.seatType.deleteMany({
          where: {
            id: {
              in: deletedSeats.map((x: any) => x.id),
            },
          },
        }),
        client.seatType.createMany({
          data: newSeats.map((x) => ({
            name: x.name,
            description: x.description,
            price: x.price,
            capacity: x.capacity,
            eventId,
          })),
        }),
        ...updateSeats.map((x) =>
          client.seatType.update({
            where: {
              id: x.id,
            },
            data: {
              name: x.name,
              description: x.description,
              price: x.price,
              capacity: x.capacity,
            },
          })
        ),
      ]);

      res.json({
        message: "seats updated",
      });
      return;
    } catch (error) {
      res.status(500).json({
        message: "Could not update seats",
      });
      return;
    }
  }
);
export default router;
