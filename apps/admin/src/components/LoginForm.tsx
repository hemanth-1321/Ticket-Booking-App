"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { useAuthStore } from "@/store/useAuthStore";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { InputOTPControlled } from "./Otp";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useState } from "react";
import axios from "axios";
import { BACKEND_URL } from "@/lib/config";
const formSchema = z.object({
  username: z.string().min(2, {
    message: "Username must be at least 2 characters.",
  }),
  number: z
    .string()
    .length(10, { message: "Phone number must be exactly 10 digits." })
    .regex(/^\d+$/, { message: "Phone number must contain only numbers." }),
});

export function LoginForm() {
  const router = useRouter();
  const { toast } = useToast();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const setNumber = useAuthStore((state) => state.setNumber);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      username: "",
      number: "",
    },
  });

  const onSubmit = async (data: z.infer<typeof formSchema>) => {
    const response = await axios.post(`${BACKEND_URL}/admin/signin`, {
      name: data.username,
      number: data.number,
    });
    if (response.status === 200) {
      setIsDialogOpen(true);
      setNumber(data.number);
    } else {
      toast({
        title: "Error",
        description: "Invalid username or phone number",
      });
    }
  };
  return (
    <div className="flex items-center justify-center mt-44 md:mt-16 lg:mt-16">
      <div className="w-80 p-6 shadow-md bg-white dark:bg-[#171717] rounded-lg">
        {" "}
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            <FormField
              control={form.control}
              name="username"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Username</FormLabel>
                  <FormControl>
                    <Input placeholder="John-Doe" {...field} />
                  </FormControl>

                  <FormMessage />
                </FormItem>
              )}
            />{" "}
            <FormField
              control={form.control}
              name="number"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Phone-number</FormLabel>
                  <FormControl>
                    <Input placeholder="1234567890" {...field} />
                  </FormControl>

                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type="submit" className="button">
              Submit
            </Button>
          </form>
        </Form>
      </div>
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Enter OTP</DialogTitle>
          </DialogHeader>
          <InputOTPControlled />
        </DialogContent>
      </Dialog>
    </div>
  );
}
