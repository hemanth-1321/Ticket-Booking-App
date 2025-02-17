import {
  S3Client,
  PutObjectCommand,
  GetObjectCommand,
} from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { tryCatch } from "bullmq";
import path from "path";

if (
  !process.env.AWS_ACCESS_KEY_ID ||
  !process.env.AWS_SECRET_ACCESS_KEY ||
  !process.env.AWS_REGION ||
  !process.env.AWS_S3_BUCKET_NAME
) {
  throw new Error("Missing AWS environment variables");
}

const s3 = new S3Client({
  region: process.env.AWS_REGION!,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!,
  },
});

export const getPresignedUrl = async (
  fileName: string,
  fileType: string,
  folder: string = ""
) => {
  const uniqueFileName = `${Date.now()}_${fileName}`;
  const filePath = path.posix.join(folder, uniqueFileName);

  const command = new PutObjectCommand({
    Bucket: process.env.AWS_S3_BUCKET_NAME!,
    Key: filePath,
    ContentType: fileType,
  });

  try {
    const uploadURL = await getSignedUrl(s3, command, { expiresIn: 300 });
    return { uploadURL, filePath };
  } catch (error) {
    console.error("Error generating pre-signed URL:", error);
    throw new Error("Failed to generate pre-signed URL");
  }
};

export const getPresignedGetUrl = async (filePath: string) => {
  const command = new GetObjectCommand({
    Bucket: process.env.AWS_S3_BUCKET_NAME!,
    Key: filePath,
  });
  try {
    const downloadUrl = await getSignedUrl(s3, command, { expiresIn: 86400 });
    return downloadUrl;
  } catch (error) {
    console.error("Error generating pre-signed download URL:", error);
    throw new Error("Failed to generate pre-signed download URL");
  }
};
