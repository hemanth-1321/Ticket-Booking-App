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
    <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 w-full">
      <div className="flex flex-col items-center p-2 md:mt-8">
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
      <div className="col-span-3 p-4">
        <Locations />
      </div>
    </div>
  );
};

export default page;
