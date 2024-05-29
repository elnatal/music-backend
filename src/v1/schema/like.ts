import { z } from "zod";

export const LikeSchema = z.object({
  liked: z.boolean(),
});
