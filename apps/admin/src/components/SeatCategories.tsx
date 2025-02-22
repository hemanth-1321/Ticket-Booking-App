"use client";
import React, { useState, useEffect } from "react";
import { PlusCircle, MinusCircle, Calendar, MapPin } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

interface Seat {
  name: string;
  description: string;
  price: number;
  capacity: number;
}

export const SeatCategories = ({
  seats,
  setSeats,
}: {
  seats: Seat[];
  setSeats: (seats: Seat[]) => void;
}) => {
  const addSeat = () => {
    setSeats([...seats, { name: "", description: "", price: 0, capacity: 0 }]);
  };

  const removeSeat = (index: number) => {
    setSeats(seats.filter((_, i) => i !== index));
  };

  const updateSeat = (
    index: number,
    field: keyof Seat,
    value: string | number
  ) => {
    const newSeats = [...seats];
    newSeats[index] = { ...newSeats[index], [field]: value };
    setSeats(newSeats);
  };

  return (
    <div className="min-h-screen bg-background text-foreground p-8">
      <div className="max-w-4xl mx-auto">
        <h2 className="text-xl font-semibold text-primary">Seat Categories</h2>
        <div className="space-y-4">
          {seats.map((seat, index) => (
            <div key={index} className="grid grid-cols-2 gap-4">
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
                  type="number"
                  className="mt-2"
                  min="1"
                  value={seat.capacity}
                  onChange={(e) =>
                    updateSeat(index, "capacity", Number(e.target.value))
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
                  type="number"
                  className="mt-2"
                  min="0"
                  value={seat.price}
                  onChange={(e) =>
                    updateSeat(index, "price", Number(e.target.value))
                  }
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
        <Button
          type="button"
          onClick={addSeat}
          variant="outline"
          className="mt-4"
        >
          <PlusCircle className="w-4 h-4 mr-2" /> Add Seat Category
        </Button>
      </div>
    </div>
  );
};
