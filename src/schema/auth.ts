import { z } from "zod";

export const SignupSchema = z.object({
  idToken: z.string(),
});
