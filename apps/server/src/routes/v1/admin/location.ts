import { Router } from "express";
import { client } from "@repo/db/client";

import { adminMiddleware } from "../../../middleware/admin";
import { CreateLocationSchema } from "../../../types";
import { superAdminMiddleware } from "../../../middleware/superAdmin";

const router: Router = Router();

router.post("/", adminMiddleware, async (req, res) => {
  const { data, success, error } = CreateLocationSchema.safeParse(req.body);

  console.log("Parsed Data:", data);
  console.log("Validation Errors:", error);
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
    const location = await client.location.create({
      data: {
        name: data.name,
        description: data.description,
        imageUrl: data.imageUrl,
      },
    });

    res.status(201).json({
      id: location.id,
    });
  } catch (error) {
    res.status(500).json({
      message: "Could not create location",
    });
  }
});

router.get("/locations", adminMiddleware, async (req, res) => {
  const locations = await client.location.findMany();

  res.json({
    locations,
  });
});

export default router;
