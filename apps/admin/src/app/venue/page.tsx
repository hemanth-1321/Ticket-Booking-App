"use client";
import { useState } from "react";
import axios from "axios";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { BACKEND_URL } from "@/lib/config";

const page = () => {
  const [file, setFile] = useState<File | null>(null);
  const [imageUrl, setImageUrl] = useState<string>("");
  const [loading, setLoading] = useState(false);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    console.log("file ed");
    if (event.target.files && event.target.files.length > 0) {
      setFile(event.target.files[0]);
    }
  };

  console.log(file?.name, file?.type);

  const handleUpload = async () => {
    if (!file) return;
    setLoading(true);

    try {
      // 1️⃣ Get Pre-signed URL from Backend
      const { data } = await axios.post(
        `${BACKEND_URL}/admin/location/presigned-url`,
        {
          fileName: file.name,
          fileType: file.type,
        }
      );

      const { uploadURL, filePath } = data;

      // 2️⃣ Upload File to S3
      await axios.put(uploadURL, file, {
        headers: { "Content-Type": file.type },
      });

      // 3️⃣ Store Final Image URL
      const finalUrl = `https://${process.env.NEXT_PUBLIC_S3_BUCKET}.s3.${process.env.NEXT_PUBLIC_AWS_REGION}.amazonaws.com/${filePath}`;
      setImageUrl(finalUrl);
    } catch (error) {
      console.error("Upload failed:", error);
    }
    setLoading(false);
  };

  return (
    <Card className="p-6 space-y-4 w-full max-w-md mx-auto">
      <Input type="file" onChange={handleFileChange} />
      <Button onClick={handleUpload} disabled={loading || !file}>
        {loading ? "Uploading..." : "Upload to S3"}
      </Button>
      {imageUrl && (
        <img src={imageUrl} alt="Uploaded File" className="rounded-xl mt-4" />
      )}
    </Card>
  );
};

export default page;
