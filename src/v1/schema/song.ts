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

/***
 * @openapi
 *  components:
 *    schema:
 *      CreateSongInput:
 *        type: object
 *        required:
 *          - title
 *          - fileUrl
 *          - genres
 *        properties:
 *          title:
 *            type: string
 *          fileUrl:
 *            type: string
 *          genres:
 *            type: array
 *            items:
 *              type: string
 *      UpdateSongInput:
 *        type: object
 *        properties:
 *          title:
 *            type: string
 *          fileUrl:
 *            type: string
 *          genres:
 *            type: array
 *            items:
 *              type: string
 *      SongResponse:
 *        type: object
 *        properties:
 *          song:
 *            type: object
 *            properties:
 *              id:
 *                type: string
 *              title:
 *                type: string
 *              fileUrl:
 *                type: string
 *              artist:
 *                type: object
 *                properties:
 *                  id:
 *                    type: string
 *                  name:
 *                    type: string
 *              genres:
 *                type: array
 *                items:
 *                  type: object
 *                  properties:
 *                    id:
 *                      type: string
 *                    name:
 *                      type: string
 *              likes:
 *                type: number
 *              liked:
 *                type: boolean
 *              createdAt:
 *                type: string
 *      SongsResponse:
 *        type: object
 *        properties:
 *          songs:
 *            type: array
 *            items:
 *              type: object
 *              properties:
 *                id:
 *                  type: string
 *                title:
 *                  type: string
 *                fileUrl:
 *                  type: string
 *                artist:
 *                  type: object
 *                  properties:
 *                    id:
 *                      type: string
 *                    name:
 *                      type: string
 *                genres:
 *                  type: array
 *                  items:
 *                    type: object
 *                    properties:
 *                      id:
 *                        type: string
 *                      name:
 *                        type: string
 *                likes:
 *                  type: number
 *                liked:
 *                  type: boolean
 *                createdAt:
 *                  type: string
 *          count:
 *            type: number
 */
