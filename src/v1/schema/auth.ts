import { z } from "zod";

export const AuthSchema = z.object({
  idToken: z.string(),
});

/**
 * @openapi
 *  components:
 *    schema:
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
