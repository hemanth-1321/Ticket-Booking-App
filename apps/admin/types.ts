"use client";

import { number, z } from "zod";

export const formSchema = z.object({
  number: z.number().min(10).max(10),
});
