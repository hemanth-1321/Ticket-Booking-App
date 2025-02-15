"use client";

import * as React from "react";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from "@/components/ui/input-otp";
import { motion } from "framer-motion";
import { useAuth } from "@/lib/useAuth";
import { Button } from "./ui/button";
import { useRouter } from "next/navigation";
import axios from "axios";
import { BACKEND_URL } from "@/lib/config";
import { useToast } from "@/hooks/use-toast";
import { useAuthStore } from "@/app/store/useAuthStore";
export function InputOTPControlled() {
  const { toast } = useToast();
  const [value, setValue] = React.useState("");
  const router = useRouter();
  const number = useAuthStore((state) => state.number);
  const { login } = useAuth();
  const handleOnSubmit = async () => {
    if (!number) {
      toast({ title: "Error", description: "Phone number is missing." });
      return;
    }
    if (value.length === 6) {
      console.log("Entered OTP:", value);
      const response = await axios.post(`${BACKEND_URL}/admin/signin/verify`, {
        otp: value,
        number: number,
      });
      if (response.status === 200) {
        login(response.data.token);
        router.push("/");
      } else {
        toast({
          title: "Error",
          description: "Invalid OTP",
        });
      }
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 100 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="space-y-2 ">
        <InputOTP
          maxLength={6} // ✅ Set maxLength to 4
          value={value}
          onChange={setValue}
        >
          <InputOTPGroup>
            <InputOTPSlot index={0} />
            <InputOTPSlot index={1} />
            <InputOTPSlot index={2} />
            <InputOTPSlot index={3} />
            <InputOTPSlot index={4} />
            <InputOTPSlot index={5} />
          </InputOTPGroup>
        </InputOTP>

        <div className="text-center text-sm">
          <p>Please enter the OTP sent to your phone number.</p>
        </div>

        <Button onClick={handleOnSubmit} className="button">
          Submit
        </Button>
      </div>
    </motion.div>
  );
}
