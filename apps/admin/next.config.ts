import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */ images: {
    domains: ["ticket-app-booking.s3.ap-south-1.amazonaws.com"], // ✅ Add your S3 domain here
  },
};

export default nextConfig;
