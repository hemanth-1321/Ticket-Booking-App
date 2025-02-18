"use client";
import { useState } from "react";
import axios from "axios";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { BACKEND_URL } from "@/lib/config";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useRouter } from "next/navigation";
import { toast } from "@/hooks/use-toast";
export const VenuForm = () => {
  const [file, setFile] = useState<File | null>(null);
  const [imageUrl, setImageUrl] = useState<string>("");
  const [loading, setLoading] = useState(false);
  const [filePath, setFilePath] = useState<string>("");
  const [name, setName] = useState<string>("");
  const [description, setDescription] = useState<string>("");
  const router = useRouter();
  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
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
      setFilePath(filePath);
      console.log("filePath", filePath);

      // 2️⃣ Upload File to S3
      await axios.put(uploadURL, file, {
        headers: { "Content-Type": file.type },
      });

      const finalUrl = `https://${process.env.NEXT_PUBLIC_S3_BUCKET}.s3.${process.env.NEXT_PUBLIC_AWS_REGION}.amazonaws.com/${filePath}`;
      setImageUrl(finalUrl);

      //create location End-point
      const token = localStorage.getItem("jwtToken");

      if (!token) {
        console.error("No authentication token found.");
        return;
      }
      const res = await axios.post(
        `${BACKEND_URL}/admin/location`,
        {
          name,
          description,
          imageUrl: filePath,
        },
        {
          headers: {
            Authorization: token,
          },
        }
      );
      if (res.status == 200 || 201) {
        toast({
          title: `${name} Added successfully`,
          description: "The location was added successfully to the database.",
        });
        router.push("/");
      }
    } catch (error) {
      console.error("Upload failed:", error);
    }
    setLoading(false);
  };

  return (
    <div className="mt-36 sm:mt-0">
      <Card className="p-8 space-y-6 w-full max-w-lg mx-auto bg-gray-300 dark:bg-[#171717] rounded-xl shadow-lg border border-gray-200">
        <div className="space-y-4">
          {/* Name Field */}
          <div className="space-y-1">
            <Label className="text-lg font-semibold">
              Name Of The Location
            </Label>
            <Input
              type="text"
              value={name}
              placeholder="Ex:DY Patil Stadium, Mumbai"
              onChange={(e) => setName(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Description Field */}
          <div className="space-y-1">
            <Label className="text-lg font-semibold">Description</Label>
            <Textarea
              value={description}
              placeholder="Ex: Narendra Modi Stadium, Ahmedabad. Accommodations: Hotels in Mumbai, Hotels in Ahmedabad"
              onChange={(e) => setDescription(e.target.value)}
              className="w-full h-28 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* File Upload */}
          <div className="space-y-1">
            <Label className="text-lg font-semibold">Upload Image</Label>
            <Input
              type="file"
              onChange={handleFileChange}
              className="w-full py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Upload Button */}
          <Button onClick={handleUpload} className="w-full button">
            {loading ? "Uploading..." : "Upload"}
          </Button>
        </div>
      </Card>
    </div>
  );
};
