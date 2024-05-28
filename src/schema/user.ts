import { AccountType } from "@prisma/client";
import { z } from "zod";

export const UpdateUserSchema = z.object({
  name: z.string().nullish(),
  dateOfBirth: z.string().nullish(),
});

export const ChangeAccountTypeSchema = z.object({
  userId: z.string(),
  accountType: z.nativeEnum(AccountType),
});
