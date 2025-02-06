"use client";
import React, { useState } from "react";
import {
  PlusCircle,
  MinusCircle,
  Calendar,
  Clock,
  MapPin,
  Image,
  Ticket,
} from "lucide-react";

export default function EventForm() {
  const [seats, setSeats] = useState([
    { name: "", description: "", price: 0, capacity: 0 },
  ]);

  const addSeat = () => {
    setSeats([...seats, { name: "", description: "", price: 0, capacity: 0 }]);
  };

  const removeSeat = (index: number) => {
    setSeats(seats.filter((_, i) => i !== index));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle form submission
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 space-y-6 sm:space-y-8">
      <div className="bg-gradient-to-r from-rose-400 to-pink-400 rounded-lg p-4 sm:p-6 text-white">
        <h1 className="text-2xl sm:text-3xl font-bold">Create New Event</h1>
        <p className="text-rose-50 text-sm sm:text-base">
          Set up your event details and ticket types
        </p>
      </div>

      <form
        onSubmit={handleSubmit}
        className="space-y-6 sm:space-y-8  dark:bg-black"
      >
        <div className="bg-white  dark:bg-black rounded-lg p-4 sm:p-6 shadow-lg space-y-4 sm:space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1 sm:mb-2">
                Event Name
              </label>
              <input
                type="text"
                className="w-full px-3 sm:px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-rose-300 focus:border-transparent text-sm sm:text-base"
                placeholder="Enter event name"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1 sm:mb-2">
                Location
              </label>
              <select className="w-full px-3 sm:px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-rose-300 focus:border-transparent text-sm sm:text-base">
                <option>Select location</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1 sm:mb-2">
                Start Date
              </label>
              <div className="relative">
                <Calendar className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
                <input
                  type="date"
                  className="w-full pl-10 sm:pl-12 pr-3 sm:pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-rose-300 focus:border-transparent text-sm sm:text-base"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1 sm:mb-2">
                Start Time
              </label>
              <div className="relative">
                <Clock className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
                <input
                  type="time"
                  className="w-full pl-10 sm:pl-12 pr-3 sm:pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-rose-300 focus:border-transparent text-sm sm:text-base"
                />
              </div>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1 sm:mb-2">
              Description
            </label>
            <textarea
              className="w-full px-3 sm:px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-rose-300 focus:border-transparent text-sm sm:text-base"
              rows={4}
              placeholder="Describe your event"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1 sm:mb-2">
              Banner Image URL
            </label>
            <div className="relative">
              <Image className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
              <input
                type="url"
                className="w-full pl-10 sm:pl-12 pr-3 sm:pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-rose-300 focus:border-transparent text-sm sm:text-base"
                placeholder="Enter banner image URL"
              />
            </div>
          </div>
        </div>

        <div className="bg-white   dark:bg-black  rounded-lg p-4 sm:p-6 shadow-lg">
          <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 sm:gap-0 mb-6">
            <h2 className="text-lg sm:text-xl font-semibold flex items-center gap-2">
              <Ticket className="h-5 w-5" />
              Ticket Types
            </h2>
            <button
              type="button"
              onClick={addSeat}
              className="flex items-center justify-center gap-2 px-4 py-2 bg-rose-400 text-white rounded-lg hover:bg-rose-500 transition-colors text-sm sm:text-base w-full sm:w-auto"
            >
              <PlusCircle className="h-5 w-5" />
              Add Ticket Type
            </button>
          </div>

          <div className="space-y-4 sm:space-y-6">
            {seats.map((seat, index) => (
              <div
                key={index}
                className="p-3 sm:p-4 border border-gray-200 rounded-lg relative"
              >
                <button
                  type="button"
                  onClick={() => removeSeat(index)}
                  className="absolute right-2 sm:right-4 top-2 sm:top-4 text-gray-400 hover:text-red-500"
                >
                  <MinusCircle className="h-5 w-5" />
                </button>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1 sm:mb-2">
                      Ticket Name
                    </label>
                    <input
                      type="text"
                      className="w-full px-3 sm:px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-rose-300 focus:border-transparent text-sm sm:text-base"
                      placeholder="e.g., VIP, Standard"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1 sm:mb-2">
                      Price (USD)
                    </label>
                    <input
                      type="number"
                      className="w-full px-3 sm:px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-rose-300 focus:border-transparent text-sm sm:text-base"
                      placeholder="0.00"
                      min="0"
                      step="0.01"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1 sm:mb-2">
                      Capacity
                    </label>
                    <input
                      type="number"
                      className="w-full px-3 sm:px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-rose-300 focus:border-transparent text-sm sm:text-base"
                      placeholder="Number of seats"
                      min="1"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1 sm:mb-2">
                      Description
                    </label>
                    <input
                      type="text"
                      className="w-full px-3 sm:px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-rose-300 focus:border-transparent text-sm sm:text-base"
                      placeholder="Ticket benefits"
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <button
          type="submit"
          className="w-full py-2.5 sm:py-3 bg-gradient-to-r from-rose-400 to-pink-400 text-white rounded-lg hover:from-rose-500 hover:to-pink-500 transition-all duration-300 font-semibold text-sm sm:text-base"
        >
          Create Event
        </button>
      </form>
    </div>
  );
}
