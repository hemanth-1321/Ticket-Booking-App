"use client";
import React, { useState } from "react";
import { Label } from "./ui/label";
import { Button } from "./ui/button"; // Importing Button component
import { ImageIcon } from "lucide-react";

export const EventBanner = () => {
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const imageUrl = URL.createObjectURL(file);
      setSelectedImage(imageUrl);
    }
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
        <Button>Upload</Button>
      </div>
    </div>
  );
};
