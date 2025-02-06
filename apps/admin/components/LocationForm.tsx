"use client";
import React from "react";
import { MapPin, Image } from "lucide-react";

export default function LocationForm() {
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle form submission
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 space-y-6 sm:space-y-8">
      <div className="bg-gradient-to-r from-sky-400 to-blue-400 rounded-lg p-4 sm:p-6 text-white">
        <h1 className="text-2xl sm:text-3xl font-bold">Add New Venue</h1>
        <p className="text-sky-50 text-sm sm:text-base">
          Register a new location for hosting events
        </p>
      </div>

      <form
        onSubmit={handleSubmit}
        className="bg-white rounded-lg p-4 sm:p-6 shadow-lg space-y-4 sm:space-y-6"
      >
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1 sm:mb-2">
            Venue Name
          </label>
          <div className="relative">
            <MapPin className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
            <input
              type="text"
              className="w-full pl-10 sm:pl-12 pr-3 sm:pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-sky-300 focus:border-transparent text-sm sm:text-base"
              placeholder="Enter venue name"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1 sm:mb-2">
            Description
          </label>
          <textarea
            className="w-full px-3 sm:px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-sky-300 focus:border-transparent text-sm sm:text-base"
            rows={4}
            placeholder="Describe the venue (facilities, capacity, etc.)"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1 sm:mb-2">
            Venue Image URL
          </label>
          <div className="relative">
            <Image className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
            <input
              type="url"
              className="w-full pl-10 sm:pl-12 pr-3 sm:pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-sky-300 focus:border-transparent text-sm sm:text-base"
              placeholder="Enter venue image URL"
            />
          </div>
        </div>

        <button
          type="submit"
          className="w-full py-2.5 sm:py-3 bg-gradient-to-r from-sky-400 to-blue-400 text-white rounded-lg hover:from-sky-500 hover:to-blue-500 transition-all duration-300 font-semibold text-sm sm:text-base"
        >
          Add Venue
        </button>
      </form>
    </div>
  );
}
