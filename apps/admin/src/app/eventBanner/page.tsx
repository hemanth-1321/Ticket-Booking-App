import { EventBanner } from "@/components/EventBanner";
import React from "react";

const page = () => {
  return (
    <div className="min-h-screen bg-background text-foreground p-8">
      <div className="max-w-4xl mx-auto">
        <EventBanner />
      </div>
    </div>
  );
};

export default page;
