import { string, z } from "zod";

export const CreateEventSchema = z.object({
  name: z.string(),
  description: z.string(),
  startTime: z.string(),
  location: z.string(),
  banner: z.string(),
});

export const CreateLocationSchema = z.object({
  name: z.string(),
  desciption: z.string(),
  imageUrl: z.string(),
});

export const UpdateEventSchema = z.object({
  name: z.string(),
  description: z.string(),
  startTime: z.string(),
  location: z.string(),
  banner: z.string(),
  published: z.boolean(),
  ended: z.boolean(),
});
