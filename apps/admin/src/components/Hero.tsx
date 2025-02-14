import React from "react";

export const Hero = () => {
  return (
    <div className="">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="mt-20 p-6 md:m-10 md:p-8 lg:m-10 lg:p-8">
          <h1 className="text-xl md:text-2xl font-bold">
            Welcome to <span className="bg-gradient-text">Event-Go Admin</span>
          </h1>
          <p className="mt-4 text-lg">
            Manage and curate{" "}
            <span className="bg-gradient-text font-bold">
              live events & shows
            </span>{" "}
            seamlessly! Add new events, update details, and ensure a smooth
            experience for attendees. Your dashboard makes event management
            effortless.
          </p>
        </div>

        <div></div>
      </div>
    </div>
  );
};
