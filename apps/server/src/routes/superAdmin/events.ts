import { client } from "@repo/db/client";
import { Router } from "express";
import { superAdminMiddleware } from "../../middleware/superAdmin";
import { UpdateEventSchema } from "@repo/common/types";

const router: Router = Router();

router.get("/", superAdminMiddleware, async (req, res) => {
  const events = await client.event.findMany();
  res.json({
    events,
  });
});

router.put("/metadata/:eventId", superAdminMiddleware, async (req, res) => {
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
    await client.event.update({
      where: {
        id: eventId,
      },

      data: {
        name: data.name,
        description: data.description,
        startTime: data.startTime,
        LocationId: data.location,
        banner: data.banner,
        adminId,
        published: data.published,
        ended: data.ended,
      },
    });
    res.json({
      messsage: "event updated successfully",
    });
  } catch (error) {
    res.json(500).json({
      message: "Could not found event",
    });
  }
});

export default router;
