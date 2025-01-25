import { client } from "@repo/db/client";
import { Router } from "express";
import { adminMiddleware } from "../../../middleware/admin";
import { CreateEventSchema } from "@repo/common/types";
const router: Router = Router();

router.post("/", adminMiddleware, async (req, res) => {
  const { data, success } = CreateEventSchema.safeParse(req.body);
  const adminId = req.userId;

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

  try {
    const event = client.event.create({
      data: {
        name: data.name,
        description: data.description,
        startTime: data.startTime,
        LocationId: data.location,
        banner: data.banner,
        adminId,
      },
    });
    res.json({
      event,
    });
  } catch (error) {
    res.status(500).json({
      message: "Coould not create event",
    });
  }
});

router.get("/events", adminMiddleware, async (req, res) => {
  const events = await client.event.findMany({
    where: {
      adminId: req.userId,
    },
  });
  res.json({
    events,
  });
});
export default router;
