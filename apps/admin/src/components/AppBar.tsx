"use client";

import React, { useState } from "react";
import { useAuth } from "@/lib/useAuth";
import Link from "next/link";
import ThemeToggle from "./ThemeToggle";
import { Menu, X } from "lucide-react"; // Icons for mobile menu
import { Button } from "./ui/button";

export const AppBar = () => {
  const { isAuthenticated, login, logout } = useAuth();
  const [isOpen, setIsOpen] = useState(false); // Mobile menu state
  const [loading, setLoading] = useState(false);
  return (
    <div className="flex justify-between items-center m-4 p-4 md:m-6 md:p-6 lg:m-6 lg:p-6 h-16 shadow-md bg-gray-300 dark:bg-[#0a0a0a] rounded-lg">
      {/* Logo */}
      <div className="flex items-center">
        <Link href="/">
          <img
            src="./AppLogo.png"
            alt="logo"
            className="w-16 md:w-20 lg:w-20 h-auto"
          />
        </Link>
      </div>

      <div className="flex items-center md:hidden">
        <div className="ml-">
          <ThemeToggle />
        </div>
        {isAuthenticated && (
          <button className="ml-4" onClick={() => setIsOpen(!isOpen)}>
            {isOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        )}
      </div>

      {/* Desktop Navigation */}
      <div className="hidden md:flex items-center gap-6">
        <ThemeToggle />

        {loading ? (
          <p>Loading...</p>
        ) : isAuthenticated ? (
          <>
            <Link href="/events">Events</Link>
            <Link href="/venue">Venue</Link>
            <Link href="/bookings">Bookings</Link>
            <button onClick={logout} className="text-red-500">
              Logout
            </button>
          </>
        ) : (
          <Link href="/auth">
            <Button className="button">Login</Button>
          </Link>
        )}
      </div>

      {isOpen && isAuthenticated && (
        <div className="absolute top-16 right-6 bg-white dark:bg-[#0a0a0a] shadow-lg p-4 rounded-md flex flex-col gap-3 md:hidden">
          <Link href="/events">Events</Link>
          <Link href="/venue">Venue</Link>
          <Link href="/bookings">Bookings</Link>
          <button onClick={logout} className="text-red-500">
            Logout
          </button>
        </div>
      )}

      {!isAuthenticated && !loading && (
        <div className="md:hidden">
          <Link href="/auth">
            <Button className="button">Login</Button>
          </Link>
        </div>
      )}
    </div>
  );
};
