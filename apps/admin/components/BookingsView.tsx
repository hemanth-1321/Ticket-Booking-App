"use client";
import React, { useState } from "react";
import {
  Search,
  Calendar,
  User,
  DollarSign,
  CheckCircle,
  XCircle,
  Filter,
} from "lucide-react";

type Booking = {
  id: string;
  eventName: string;
  customerName: string;
  ticketType: string;
  quantity: number;
  totalAmount: number;
  bookingDate: string;
  status: "confirmed" | "pending" | "cancelled";
};

const mockBookings: Booking[] = [
  {
    id: "1",
    eventName: "Summer Music Festival",
    customerName: "John Doe",
    ticketType: "VIP",
    quantity: 2,
    totalAmount: 200,
    bookingDate: "2024-03-15",
    status: "confirmed",
  },
  {
    id: "2",
    eventName: "Comedy Night",
    customerName: "Jane Smith",
    ticketType: "Standard",
    quantity: 3,
    totalAmount: 150,
    bookingDate: "2024-03-16",
    status: "pending",
  },
];

export default function BookingsView() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedEvent, setSelectedEvent] = useState<string>("all");
  const [selectedStatus, setSelectedStatus] = useState<string>("all");

  const getStatusColor = (status: string) => {
    switch (status) {
      case "confirmed":
        return "text-green-600 bg-green-50";
      case "pending":
        return "text-amber-600 bg-amber-50";
      case "cancelled":
        return "text-red-600 bg-red-50";
      default:
        return "text-gray-600 bg-gray-50";
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "confirmed":
        return <CheckCircle className="w-4 h-4" />;
      case "cancelled":
        return <XCircle className="w-4 h-4" />;
      default:
        return null;
    }
  };

  const filteredBookings = mockBookings.filter((booking) => {
    const matchesSearch =
      booking.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      booking.eventName.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesEvent =
      selectedEvent === "all" || booking.eventName === selectedEvent;
    const matchesStatus =
      selectedStatus === "all" || booking.status === selectedStatus;
    return matchesSearch && matchesEvent && matchesStatus;
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6">
      <div className="bg-gradient-to-r from-amber-400 to-orange-400 rounded-lg p-4 sm:p-6 text-white mb-6">
        <h1 className="text-2xl sm:text-3xl font-bold">Booking Management</h1>
        <p className="text-amber-50 text-sm sm:text-base">
          View and manage event bookings
        </p>
      </div>

      <div className="bg-white rounded-lg shadow-lg p-4 sm:p-6">
        <div className="flex flex-col sm:flex-row gap-4 mb-6">
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search by customer or event name"
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-300 focus:border-transparent"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>

          <div className="flex gap-4">
            <select
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-300 focus:border-transparent"
              value={selectedEvent}
              onChange={(e) => setSelectedEvent(e.target.value)}
            >
              <option value="all">All Events</option>
              <option value="Summer Music Festival">
                Summer Music Festival
              </option>
              <option value="Comedy Night">Comedy Night</option>
            </select>

            <select
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-300 focus:border-transparent"
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
            >
              <option value="all">All Statuses</option>
              <option value="confirmed">Confirmed</option>
              <option value="pending">Pending</option>
              <option value="cancelled">Cancelled</option>
            </select>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-gray-50">
                <th className="px-4 py-3 text-left text-sm font-medium text-gray-500">
                  Event
                </th>
                <th className="px-4 py-3 text-left text-sm font-medium text-gray-500">
                  Customer
                </th>
                <th className="px-4 py-3 text-left text-sm font-medium text-gray-500">
                  Ticket Type
                </th>
                <th className="px-4 py-3 text-left text-sm font-medium text-gray-500">
                  Quantity
                </th>
                <th className="px-4 py-3 text-left text-sm font-medium text-gray-500">
                  Total
                </th>
                <th className="px-4 py-3 text-left text-sm font-medium text-gray-500">
                  Date
                </th>
                <th className="px-4 py-3 text-left text-sm font-medium text-gray-500">
                  Status
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {filteredBookings.map((booking) => (
                <tr key={booking.id} className="hover:bg-gray-50">
                  <td className="px-4 py-4 text-sm text-gray-900">
                    {booking.eventName}
                  </td>
                  <td className="px-4 py-4 text-sm text-gray-900">
                    {booking.customerName}
                  </td>
                  <td className="px-4 py-4 text-sm text-gray-900">
                    {booking.ticketType}
                  </td>
                  <td className="px-4 py-4 text-sm text-gray-900">
                    {booking.quantity}
                  </td>
                  <td className="px-4 py-4 text-sm text-gray-900">
                    ${booking.totalAmount}
                  </td>
                  <td className="px-4 py-4 text-sm text-gray-900">
                    {booking.bookingDate}
                  </td>
                  <td className="px-4 py-4 text-sm">
                    <span
                      className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(booking.status)}`}
                    >
                      {getStatusIcon(booking.status)}
                      {booking.status.charAt(0).toUpperCase() +
                        booking.status.slice(1)}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {filteredBookings.length === 0 && (
          <div className="text-center py-8">
            <p className="text-gray-500">
              No bookings found matching your criteria
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
