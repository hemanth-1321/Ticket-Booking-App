"use client";
import React, { useState } from "react";
import { Label } from "./ui/label";
import { Button } from "./ui/button";
import { ImageIcon } from "lucide-react";
import axios from "axios";
import { BACKEND_URL } from "@/lib/config";
import { toast } from "@/hooks/use-toast";
import { useRouter } from "next/navigation";

export const EventBanner = () => {
  const router = useRouter();
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [filePath, setFilePath] = useState<string>("");
  const [name, setName] = useState<string>("");

  const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files.length > 0) {
      const selectedFile = event.target.files[0];
      setFile(selectedFile);
      setSelectedImage(URL.createObjectURL(selectedFile));
    }
  };

  const handleUpload = async () => {
    if (!file) return;
    setLoading(true);

    try {
      const { data } = await axios.post(
        `${BACKEND_URL}/admin/event/presigned-url`,
        {
          fileName: file.name,
          fileType: file.type,
        }
      );

      const { uploadURL, filePath } = data;
      setFilePath(filePath);

      await axios.put(uploadURL, file, {
        headers: { "Content-Type": file.type },
      });

      const finalUrl = `https://${process.env.NEXT_PUBLIC_S3_BUCKET}.s3.${process.env.NEXT_PUBLIC_AWS_REGION}.amazonaws.com/${filePath}`;

      const token = localStorage.getItem("jwtToken");
      if (!token) {
        console.error("No authentication token found.");
        return;
      }

      const res = await axios.post(
        `${BACKEND_URL}/admin/event/image-upload`,
        { image_Url: filePath },
        { headers: { Authorization: token } }
      );

      if (res.status === 200 || res.status === 201) {
        toast({
          title: `${name} Added successfully`,
          description: "The location was added successfully to the database.",
        });
        router.push("/seatcategory");
      }
    } catch (error) {
      console.error("Upload failed:", error);
    }

    setLoading(false);
  };

  return (
    <div>
      <Label className="text-primary">Event Banner</Label>
      <div className="mt-2 border-2 border-dashed border-primary rounded-lg p-8 text-center flex flex-col items-center">
        {selectedImage ? (
          <img
            src={selectedImage}
            alt="Selected preview"
            className="mx-auto mb-4 rounded-lg shadow-lg w-full max-h-64 object-cover"
          />
        ) : (
          <>
            <ImageIcon className="mx-auto h-12 w-12 text-primary mb-4" />
            <p className="text-sm text-gray-500">
              Upload an event banner image
            </p>
          </>
        )}
        <div className="text-sm mt-4">
          <input
            type="file"
            id="fileInput"
            className="hidden"
            accept="image/*"
            onChange={handleImageChange}
          />
          <Button
            className="mt-2 bg-primary button px-4 py-2 rounded-md"
            onClick={() => document.getElementById("fileInput")?.click()}
          >
            Select File
          </Button>
        </div>
      </div>
      <div className="mt-2 flex justify-center items-center">
        <Button onClick={handleUpload} disabled={loading}>
          {loading ? "Uploading..." : "Upload"}
        </Button>
      </div>
    </div>
  );
};
