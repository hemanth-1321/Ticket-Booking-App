"use client";
import { SeatCategories } from "@/components/SeatCategories";
import React, { useState } from "react";
interface Seat {
  name: string;
  description: string;
  price: number;
  capacity: number;
}

const page = () => {
  const [seats, setSeats] = useState<Seat[]>([
    { name: "", description: "", price: 0, capacity: 0 },
  ]);
  return (
    <div>
      <SeatCategories seats={seats} setSeats={setSeats} />
    </div>
  );
};

export default page;
