import { z } from "zod";

export const CreateSongSchema = z.object({
  title: z.string(),
  fileUrl: z.string().url(),
  genres: z.array(z.string()),
});

export const UpdateSongSchema = z.object({
  title: z.string().optional(),
  fileUrl: z.string().url().optional(),
  genres: z.array(z.string()).optional(),
});
