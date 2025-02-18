import { Button } from "@/components/ui/button";
import React from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { VenuForm } from "@/components/VenuForm";
import { Locations } from "@/components/Locations";

const page = () => {
  return (
    <div className="grid grid-cols-2 w-full">
      <div>
        <Locations />
      </div>
      <div>
        <Dialog>
          <DialogTrigger className="button">Add a Venue</DialogTrigger>
          <DialogContent className="flex flex-col  items-center justify-center sm:max-w-md w-[90%] h-[60%] md:h-[90%] lg:h-[95%]">
            <DialogHeader className=" hidden text-center md:block lg:block">
              <DialogTitle>Venue Form</DialogTitle>
              <DialogDescription>Fill in the details below</DialogDescription>
            </DialogHeader>
            <div className="w-full flex justify-center mb-28 md:mb-0 lg:mb-0">
              <VenuForm />
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
};

export default page;
