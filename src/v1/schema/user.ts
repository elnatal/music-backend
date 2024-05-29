import { AccountType } from "@prisma/client";
import { z } from "zod";

export const UpdateUserSchema = z.object({
  name: z.string().optional(),
  dateOfBirth: z.string().optional(),
});

export const AdminUpdateUserSchema = z.object({
  accountType: z.nativeEnum(AccountType).optional(),
});
