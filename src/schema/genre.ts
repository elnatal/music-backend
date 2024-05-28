import { z } from "zod";

export const CreateGenreSchema = z.object({
  name: z.string(),
});

export const UpdateGenreSchema = z.object({
  name: z.string(),
});
