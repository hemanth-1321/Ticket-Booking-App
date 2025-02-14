"use client";
import { LoginForm } from "@/components/LoginForm";
import React from "react";
import { motion } from "framer-motion";
const page = () => {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
    >
      <LoginForm />
    </motion.div>
  );
};

export default page;
