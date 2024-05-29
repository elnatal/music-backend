import { z } from "zod";

export const AuthSchema = z.object({
  idToken: z.string(),
});

export const GetIdTokenSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
});

/**
 * @openapi
 *  components:
 *    schema:
 *      GetIdTokenInput:
 *        type: object
 *        required:
 *          - email
 *          - password
 *        properties:
 *          name:
 *            type: string
 *          password:
 *            type: string
 *      AuthInput:
 *        type: object
 *        required:
 *          - idToken
 *        properties:
 *          idToken:
 *            type: string
 *            default: "string"
 *      AuthResponse:
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
 *              createdAt:
 *                type: string
 *          token:
 *            type: string
 */
