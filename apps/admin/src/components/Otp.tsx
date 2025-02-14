"use client";

import * as React from "react";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from "@/components/ui/input-otp";
import { Button } from "./ui/button";
import { useRouter } from "next/navigation";
export function InputOTPControlled() {
  const [value, setValue] = React.useState("");
  const router = useRouter();
  const handleOnSubmit = () => {
    if (value.length === 4) {
      console.log("Entered OTP:", value);
      router.push("/");
    } else {
      alert("Please enter a 4-digit OTP.");
    }
  };

  return (
    <div className="space-y-2 ">
      <InputOTP
        maxLength={4} // ✅ Set maxLength to 4
        value={value}
        onChange={setValue}
      >
        <InputOTPGroup>
          <InputOTPSlot index={0} />
          <InputOTPSlot index={1} />
          <InputOTPSlot index={2} />
          <InputOTPSlot index={3} />
        </InputOTPGroup>
      </InputOTP>

      <div className="text-center text-sm">
        {value === ""
          ? "Enter your one-time password."
          : `You entered: ${value}`}
      </div>

      <Button onClick={handleOnSubmit} className="button">
        Submit
      </Button>
    </div>
  );
}
