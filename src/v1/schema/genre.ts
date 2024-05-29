import { z } from "zod";

export const CreateGenreSchema = z.object({
  name: z.string(),
});

export const UpdateGenreSchema = z.object({
  name: z.string(),
});

/**
 * @openapi
 *  components:
 *    schema:
 *      GenreInput:
 *        type: object
 *        required:
 *          - name
 *        properties:
 *          name:
 *            type: string
 *      GenreResponse:
 *        type: object
 *        properties:
 *          genre:
 *            type: object
 *            properties:
 *              id:
 *                type: string
 *              name:
 *                type: string
 *              createdAt:
 *                type: string
 *      GenresResponse:
 *        type: object
 *        properties:
 *          genres:
 *            type: array
 *            items:
 *              type: object
 *              properties:
 *                id:
 *                  type: string
 *                name:
 *                  type: string
 *                createdAt:
 *                  type: string
 *          count:
 *            type: number
 */
