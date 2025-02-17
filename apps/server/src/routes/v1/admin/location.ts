import { Router } from "express";
import { client } from "@repo/db/client";

import { adminMiddleware } from "../../../middleware/admin";
import { CreateLocationSchema } from "../../../types";
import { superAdminMiddleware } from "../../../middleware/superAdmin";
import { getPresignedGetUrl, getPresignedUrl } from "../../../utils/S3";

const router: Router = Router();

router.post("/presigned-url", async (req, res) => {
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
  try {
    const locations = await client.location.findMany();
    const formatedlocations = await Promise.all(
      locations.map(async (location) => {
        const imageUrl = await getPresignedGetUrl(location.imageUrl);
        return {
          id: location.id,
          name: location.name,
          description: location.description,
          imageUrl,
        };
      })
    );

    res.status(200).json({
      formatedlocations,
    });
  } catch (error) {
    console.error("Error fetching Locations", error);
    res.status(500).json({
      message: "Could not fetch locations",
    });
  }
});

router.get("/location/:id", adminMiddleware, async (req, res) => {
  const { id } = req.params;
  if (!id) {
    res.status(400).json({
      message: "Location Id not found",
    });
    return;
  }

  try {
    const location = await client.location.findUnique({
      where: {
        id: id,
      },
    });
    if (!location) {
      res.status(404).json({
        message: "Location not found",
      });
    }

    const imageUrl = await getPresignedGetUrl(location?.imageUrl ?? "");
    res.status(200).json({
      id: location?.id,
      name: location?.name,
      description: location?.description,
      imageUrl: imageUrl,
    });
  } catch (error) {
    console.error("Error Fetching location", error);
    res.status(500).json({
      message: "Error Fetching location",
    });
  }
});

export default router;
