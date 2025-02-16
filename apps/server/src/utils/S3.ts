import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";

const s3 = new S3Client({
  region: process.env.AWS_REGION!,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!,
  },
});

/**
 * Generates a pre-signed URL for uploading files to S3.
 * @param fileName - The name of the file to upload.
 * @param fileType - The MIME type of the file.
 * @param folder - The folder inside the bucket (optional).
 * @returns {Promise<{ uploadURL: string, filePath: string }>} Signed URL and file path.
 */
export const getPresignedUrl = async (
  fileName: string,
  fileType: string,
  folder: string = ""
) => {
  const filePath = `${folder}/${Date.now()}_${fileName}`.replace("//", "/");

  const command = new PutObjectCommand({
    Bucket: process.env.AWS_S3_BUCKET_NAME!,
    Key: filePath,
    ContentType: fileType,
    ACL: "public-read",
  });

  try {
    const uploadURL = await getSignedUrl(s3, command, { expiresIn: 300 });
    return { uploadURL, filePath };
  } catch (error) {
    console.error("Error generating pre-signed URL:", error);
    throw new Error("Failed to generate pre-signed URL");
  }
};
