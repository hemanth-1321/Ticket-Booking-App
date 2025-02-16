import { Router } from "express";
import { client } from "@repo/db/client";

import { adminMiddleware } from "../../../middleware/admin";
import { CreateLocationSchema } from "../../../types";
import { superAdminMiddleware } from "../../../middleware/superAdmin";
import { getPresignedUrl } from "../../../utils/S3";

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
        imageUrl: `https://${process.env.AWS_S3_BUCKET_NAME}.s3.${process.env.AWS_REGION}.amazonaws.com/${data.imageUrl}`,
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
