import { Router } from "express";
import {
  create,
  update,
  list,
  get,
  remove,
  upload,
  like,
  likedSongs,
} from "../controllers/song";
import { errorHandler } from "../../error-handler";
import roleMiddleware from "../middlewares/role";
import { uploadFile } from "../middlewares/multer";

const songRoutes: Router = Router();

/***
 * @openapi
 * '/songs':
 *  post:
 *      tags:
 *      - Song
 *      summary: Create a song
 *      description: Only artists can create a song
 *      requestBody:
 *          required: true
 *          content:
 *              application/json:
 *                  schema:
 *                      $ref: '#/components/schema/CreateSongInput'
 *      responses:
 *          200:
 *              description: Success
 *              content:
 *                 application/json:
 *                     schema:
 *                        $ref: '#/components/schema/SongResponse'
 *          401:
 *              description: Unauthorized
 *          422:
 *              description: Unprocessable Entity
 */
songRoutes.post("/", [roleMiddleware(["ARTIST"])], errorHandler(create));

/***
 * @openapi
 * '/songs/upload':
 *  post:
 *      tags:
 *      - Song
 *      summary: Upload a song
 *      description: Only artists can upload a song
 *      requestBody:
 *          required: true
 *          content:
 *              multipart/form-data:
 *                  schema:
 *                      type: object
 *                      required:
 *                        - file
 *                      properties:
 *                        file:
 *                          type: string
 *                          format: binary
 *      responses:
 *          200:
 *              description: Success
 *              content:
 *                 application/json:
 *                     schema:
 *                        type: object
 *                        properties:
 *                          fileUrl:
 *                            type: string
 *          401:
 *              description: Unauthorized
 *          422:
 *              description: Unprocessable Entity
 */
songRoutes.post(
  "/upload",
  [roleMiddleware(["ARTIST"]), uploadFile.single("file")],
  errorHandler(upload)
);

/***
 * @openapi
 * '/songs/{id}':
 *  put:
 *      tags:
 *      - Song
 *      summary: Update a song
 *      description: Only artists can update a song
 *      parameters:
 *        - name: id
 *          in: path
 *          description: Song id
 *          required: true
 *      requestBody:
 *          required: true
 *          content:
 *              application/json:
 *                  schema:
 *                      $ref: '#/components/schema/UpdateSongInput'
 *      responses:
 *          200:
 *              description: Success
 *              content:
 *                 application/json:
 *                     schema:
 *                        $ref: '#/components/schema/SongResponse'
 *          401:
 *              description: Unauthorized
 *          404:
 *              description: Song not found
 *          422:
 *              description: Unprocessable Entity
 */
songRoutes.put("/:id", [roleMiddleware(["ARTIST"])], errorHandler(update));

/***
 * @openapi
 * '/songs':
 *  get:
 *      tags:
 *      - Song
 *      summary: Get songs
 *      parameters:
 *        - in: query
 *          name: limit
 *          schema:
 *            type: integer
 *        - in: query
 *          name: skip
 *          schema:
 *            type: integer
 *      responses:
 *          200:
 *              description: Success
 *              content:
 *                 application/json:
 *                     schema:
 *                        $ref: '#/components/schema/SongsResponse'
 *          401:
 *              description: Unauthorized
 */
songRoutes.get("/", errorHandler(list));

/***
 * @openapi
 * '/songs/liked-songs':
 *  get:
 *      tags:
 *      - Song
 *      summary: Get liked songs
 *      parameters:
 *        - in: query
 *          name: limit
 *          schema:
 *            type: integer
 *        - in: query
 *          name: skip
 *          schema:
 *            type: integer
 *      responses:
 *          200:
 *              description: Success
 *              content:
 *                 application/json:
 *                     schema:
 *                        $ref: '#/components/schema/SongsResponse'
 *          401:
 *              description: Unauthorized
 */
songRoutes.get("/liked-songs", errorHandler(likedSongs));

/***
 * @openapi
 * '/songs/{id}':
 *  get:
 *      tags:
 *      - Song
 *      summary: Get a song
 *      parameters:
 *        - name: id
 *          in: path
 *          description: Song id
 *          required: true
 *      responses:
 *          200:
 *              description: Success
 *              content:
 *                 application/json:
 *                     schema:
 *                        $ref: '#/components/schema/SongResponse'
 *          401:
 *              description: Unauthorized
 *          404:
 *              description: Song not found
 */
songRoutes.get("/:id", errorHandler(get));

/***
 * @openapi
 * '/likes/{id}/like':
 *  post:
 *      tags:
 *      - Song
 *      summary: Like a song
 *      parameters:
 *        - name: id
 *          in: path
 *          description: Song id
 *          required: true
 *      requestBody:
 *          required: true
 *          content:
 *              application/json:
 *                  schema:
 *                    type: object
 *                    properties:
 *                      liked:
 *                        type: boolean
 *      responses:
 *          200:
 *              description: Success
 *              content:
 *                 application/json:
 *                  schema:
 *                    type: object
 *                    properties:
 *                      liked:
 *                        type: boolean
 *          401:
 *              description: Unauthorized
 *          404:
 *              description: Song not found
 */
songRoutes.post("/:id/like", errorHandler(like));

/***
 * @openapi
 * '/songs/{id}':
 *  delete:
 *      tags:
 *      - Song
 *      summary: Delete a song
 *      description: Only artists can delete a song
 *      parameters:
 *        - name: id
 *          in: path
 *          description: Song id
 *          required: true
 *      responses:
 *          200:
 *              description: Success
 *          401:
 *              description: Unauthorized
 */
songRoutes.delete("/:id", [roleMiddleware(["ARTIST"])], errorHandler(remove));

export default songRoutes;
