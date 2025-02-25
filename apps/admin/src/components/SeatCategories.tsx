"use client";
import React, { useState, useEffect } from "react";
import { PlusCircle, MinusCircle, Upload } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useEventStore } from "@/store/useEventStore";
import axios from "axios";
import { BACKEND_URL } from "@/lib/config";
import { toast } from "@/hooks/use-toast";
import { useRouter } from "next/navigation";
interface Seat {
  name: string;
  description: string;
  price: string;
  capacity: string;
}

export const SeatCategories = () => {
  const router = useRouter();
  const { id } = useEventStore();
  console.log(id);
  const [seats, setSeats] = useState<Seat[]>([]);
  useEffect(() => {
    setSeats([{ name: "", description: "", price: "", capacity: "" }]);
    console.log("id", id);
  }, []);

  const addSeat = () => {
    setSeats((prev) => [
      ...prev,
      { name: "", description: "", price: "", capacity: "" },
    ]);
  };

  const removeSeat = (index: number) => {
    setSeats((prev) => prev.filter((_, i) => i !== index));
  };

  const updateSeat = (index: number, field: keyof Seat, value: string) => {
    setSeats((prev) => {
      const newSeats = [...prev];
      newSeats[index] = { ...newSeats[index], [field]: value };
      return newSeats;
    });
  };

  const token = localStorage.getItem("jwtToken");
  if (!token) {
    console.error("No authentication token found.");
    return;
  }
  const uploadSeats = async () => {
    console.log("Uploaded Seats:", seats);
    const formattedSeats = {
      seats: seats.map((seat) => ({
        name: seat.name,
        description: seat.description,
        price: Number(seat.price),
        capacity: Number(seat.capacity),
      })),
    };
    const response = await axios.put(
      `${BACKEND_URL}/admin/seats/${id}`,
      formattedSeats,
      {
        headers: {
          Authorization: token,
        },
      }
    );

    if (response.status == 200) {
      toast({
        title: "Seats Added SuccessFully",
      });
      router.push("/");
    } else {
      toast({
        variant: "destructive",
        title: "Seats couldnt be Added, Please try again",
      });
    }
  };

  return (
    <div className="min-h-screen bg-background text-foreground p-8">
      <div className="max-w-4xl mx-auto">
        <h2 className="text-xl font-semibold text-primary">Seat Categories</h2>
        <div className="space-y-4">
          {seats.map((seat, index) => (
            <div
              key={index}
              className="grid grid-cols-2 gap-4 border p-4 rounded-lg"
            >
              <div>
                <Label>Seat Type</Label>
                <Input
                  type="text"
                  className="mt-2"
                  placeholder="e.g., VIP, Standard"
                  value={seat.name}
                  onChange={(e) => updateSeat(index, "name", e.target.value)}
                  required
                />
              </div>
              <div>
                <Label>Number of Seats</Label>
                <Input
                  type="text"
                  className="mt-2"
                  placeholder="Enter number of seats"
                  value={seat.capacity}
                  onChange={(e) =>
                    updateSeat(index, "capacity", e.target.value)
                  }
                  required
                />
              </div>
              <div className="col-span-2">
                <Label>Seat Benefits</Label>
                <Input
                  type="text"
                  className="mt-2"
                  placeholder="Describe the benefits"
                  value={seat.description}
                  onChange={(e) =>
                    updateSeat(index, "description", e.target.value)
                  }
                  required
                />
              </div>
              <div>
                <Label>Price per Seat</Label>
                <Input
                  type="text"
                  className="mt-2"
                  placeholder="Enter price"
                  value={seat.price}
                  onChange={(e) => updateSeat(index, "price", e.target.value)}
                  required
                />
              </div>
              <div className="flex items-end">
                {seats.length > 1 && (
                  <Button
                    variant="destructive"
                    onClick={() => removeSeat(index)}
                    type="button"
                  >
                    <MinusCircle className="w-4 h-4 mr-2" /> Remove
                  </Button>
                )}
              </div>
            </div>
          ))}
        </div>
        <div className="flex gap-4 mt-4">
          <Button type="button" onClick={addSeat} variant="outline">
            <PlusCircle className="w-4 h-4 mr-2" /> Add Seat Category
          </Button>
          <Button type="button" onClick={uploadSeats} variant="default">
            <Upload className="w-4 h-4 mr-2" /> Upload
          </Button>
        </div>
      </div>
    </div>
  );
};
