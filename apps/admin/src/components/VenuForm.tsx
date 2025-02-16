import { useState } from "react";
import axios from "axios";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { BACKEND_URL } from "@/lib/config";

export const VenuForm = () => {
  const [file, setFile] = useState<File | null>(null);
  const [imageUrl, setImageUrl] = useState<string>("");
  const [loading, setLoading] = useState(false);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    console.log("File input changed!"); // Debugging
    if (event.target.files && event.target.files.length > 0) {
      const selectedFile = event.target.files[0];
      console.log("Selected File:", selectedFile);
      console.log("File Name:", selectedFile.name);
      setFile(selectedFile);
    } else {
      console.log("No file selected.");
    }
  };

  const handleUpload = async () => {
    if (!file) {
      console.error("No file selected!");
      return;
    }

    setLoading(true);
    console.log(`Uploading File: ${file.name} (${file.type})`);

    try {
      const fileType = file.type || "image/jpeg"; // Set a default MIME type

      console.log("Sending Axios request with params:", {
        fileName: file.name,
        fileType: fileType,
      });

      // 🔹 1️⃣ Request a Pre-signed URL from Backend
      const { data } = await axios.post(
        `${BACKEND_URL}/admin/location/presigned-url`,
        {
          fileName: file.name,
          fileType: fileType,
        }
      );

      console.log("Presigned URL Response:", data);

      const { uploadURL, filePath } = data;

      if (!uploadURL || !filePath) {
        throw new Error("Missing uploadURL or filePath from backend response.");
      }

      // 🔹 2️⃣ Upload the File to S3
      await axios.put(uploadURL, file, {
        headers: { "Content-Type": fileType },
      });

      console.log("File uploaded successfully!");

      // 🔹 3️⃣ Construct Final Image URL
      const finalUrl = `https://${process.env.NEXT_PUBLIC_S3_BUCKET}.s3.${process.env.NEXT_PUBLIC_AWS_REGION}.amazonaws.com/${filePath}`;

      console.log("Final Image URL:", finalUrl);
      setImageUrl(finalUrl);
    } catch (error) {
      console.error("Upload failed:", error);
    }

    setLoading(false);
  };

  return (
    <Card className="p-6 space-y-4 w-full max-w-md mx-auto">
      <Input type="file" onChange={handleFileChange} accept="image/*" />
      <Button onClick={handleUpload} disabled={loading || !file}>
        {loading ? "Uploading..." : "Upload to S3"}
      </Button>
      {imageUrl && (
        <img src={imageUrl} alt="Uploaded File" className="rounded-xl mt-4" />
      )}
      {file && <p>Selected File: {file.name}</p>}
    </Card>
  );
};
