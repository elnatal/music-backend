import { AccountType } from "@prisma/client";
import { z } from "zod";

/**
 * @openapi
 *  components:
 *    schema:
 *      UserUpdateInput:
 *        type: object
 *        properties:
 *          name:
 *            type: string
 *          dateOfBirth:
 *            type: string
 *      AdminUserUpdateInput:
 *        type: object
 *        required:
 *          - accountType
 *        properties:
 *          accountType:
 *            type: string
 *            enum: [USER, ARTIST, ADMIN]
 *      UserResponse:
 *        type: object
 *        properties:
 *          user:
 *            type: object
 *            properties:
 *              id:
 *                type: string
 *              name:
 *                type: string
 *              dateOfBirth:
 *                type: string
 *              accountType:
 *                type: string
 *                enum: [USER, ARTIST, ADMIN]
 *              createdAt:
 *                type: string
 *      UsersResponse:
 *        type: object
 *        properties:
 *          users:
 *            type: array
 *            items:
 *              type: object
 *              properties:
 *                id:
 *                  type: string
 *                name:
 *                  type: string
 *                dateOfBirth:
 *                  type: string
 *                accountType:
 *                  type: string
 *                  enum: [USER, ARTIST, ADMIN]
 *                createdAt:
 *                  type: string
 *          count:
 *            type: number
 */

export const UpdateUserSchema = z.object({
  name: z.string().optional(),
  dateOfBirth: z.string().optional(),
});

export const AdminUpdateUserSchema = z.object({
  accountType: z.nativeEnum(AccountType).optional(),
});
