"use client";

import React, { useEffect, useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import axios from "axios";
import { BACKEND_URL } from "@/lib/config";
import { toast } from "@/hooks/use-toast";
import Image from "next/image";

interface Location {
  id: string;
  name: string;
  description: string;
  imageUrl: string;
}

export const Locations = () => {
  const [locations, setLocations] = useState<Location[]>([]);
  const [loading, setLoading] = useState(true);
  const [token, setToken] = useState("");

  useEffect(() => {
    const storedToken = localStorage.getItem("jwtToken");
    if (!storedToken) {
      toast({ title: "You are not authorized" });
      return;
    }
    setToken(storedToken);
  }, []);

  useEffect(() => {
    if (!token) return;
    console.log("reached");
    const fetchLocations = async () => {
      try {
        const response = await axios.get(
          `${BACKEND_URL}/admin/location/locations`,
          {
            headers: {
              Authorization: token,
            },
          }
        );
        console.log(response.data.formatedlocations);
        setLocations(response.data.formatedlocations);
      } catch (error) {
        console.error("Error fetching locations:", error);
        toast({ title: "Failed to fetch locations", variant: "destructive" });
      } finally {
        setLoading(false);
      }
    };

    fetchLocations();
  }, [token]);

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 p-4">
      {loading ? (
        <p className="text-center col-span-3 text-gray-500">Loading...</p>
      ) : locations.length > 0 ? (
        locations.map((location) => (
          <Card
            key={location.id}
            className="w-full h-[350px] bg-white dark shadow-lg rounded-xl overflow-hidden"
          >
            <CardHeader className="p-4">
              <CardTitle className="text-lg font-semibold text-black dark:text-white">
                {location.name}
              </CardTitle>
            </CardHeader>
            <CardContent className="p-4 flex flex-col">
              <Image
                src={location.imageUrl}
                alt="Location Image"
                width={400} // Adjusted width for better fit
                height={180}
                className="w-full h-[180px] object-cover rounded-md"
              />
              <CardDescription className="mt-4 text-black dark:text-gray-300 text-sm">
                {location.description}
              </CardDescription>
            </CardContent>
          </Card>
        ))
      ) : (
        <p className="text-center col-span-3 text-gray-500">
          No locations found.
        </p>
      )}
    </div>
  );
};
