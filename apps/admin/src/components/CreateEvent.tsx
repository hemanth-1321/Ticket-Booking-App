"use client";
import React, { useState, useEffect } from "react";
import { PlusCircle, MinusCircle, Calendar, MapPin } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { SeatCategories } from "./SeatCategories";
import { useRouter } from "next/navigation";
import axios from "axios";
import { BACKEND_URL } from "@/lib/config";
import { toast } from "@/hooks/use-toast";
import { useEventStore } from "@/store/useEventStore";
export const CreateEvent = () => {
  const { id, eventName, eventDescription, eventStartTime, setEventDetails } =
    useEventStore();
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [startTime, setStartTime] = useState("");
  const [endTime, setEndTime] = useState("");
  const [location, setLocation] = useState("");
  const [token, setToken] = useState<string>("");
  const router = useRouter();
  useEffect(() => {
    const now = new Date().toISOString().slice(0, 16);
    setStartTime(now);
    setEndTime(now);
    const storedToken = localStorage.getItem("jwtToken") || "";
    setToken(storedToken);
  }, []);

  const handleOnSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await axios.post(
        `${BACKEND_URL}/admin/event`,
        {
          name,
          description,
          startTime,
          location,
        },
        {
          headers: {
            Authorization: token,
          },
        }
      );

      if (response.status == 201) {
        setEventDetails({
          id: response.data.event.id,
          eventName: response.data.event.name,
        });

        console.log("Event ID stored in Zustand:", response.data.event.id);
        toast({
          title: "Event created successfully",
          description: "Add the Event Banner Next",
        });
        router.push("/seatcategory");
      }
    } catch (error) {
      console.error("error creating the event", error);
      toast({
        variant: "destructive",
        title: "Uh oh! Something went wrong",
        description: "Event Could'nt be created",
      });
    }
  };

  return (
    <div className="min-h-screen bg-background text-foreground p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold mb-8 text-primary">
          Create New Event
        </h1>
        <form className="space-y-8" onSubmit={handleOnSubmit}>
          <div>
            <Label className="text-primary">Event Name</Label>
            <Input
              type="text"
              className="mt-2"
              placeholder="Enter event name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>
          <div>
            <Label className="text-primary">Description</Label>
            <Textarea
              className="mt-2"
              placeholder="Describe your event"
              rows={4}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              required
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label className="text-primary flex items-center">
                <Calendar className="w-4 h-4 mr-2" />
                Start Time
              </Label>
              <Input
                type="datetime-local"
                className="mt-2 p-2 "
                value={startTime}
                onChange={(e) => setStartTime(e.target.value)}
                required
              />
            </div>
          </div>
          <div>
            <Label className="text-primary flex items-center">
              <MapPin className="w-4 h-4 mr-2" />
              Location
            </Label>
            <Input
              type="text"
              className="mt-2"
              placeholder="Enter location"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              required
            />
          </div>
          <Button type="submit" className="w-full">
            Create Event
          </Button>
        </form>
      </div>
    </div>
  );
};
