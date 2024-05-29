import { Router } from "express";
import { create, update, list, get, remove } from "../controllers/genre";
import { errorHandler } from "../../error-handler";
import roleMiddleware from "../middlewares/role";

const genreRoutes: Router = Router();

/***
 * @openapi
 * '/genres':
 *  post:
 *      tags:
 *      - Genre
 *      summary: Create a genre
 *      description: Only admins can create a genre
 *      requestBody:
 *          required: true
 *          content:
 *              application/json:
 *                  schema:
 *                      $ref: '#/components/schema/GenreInput'
 *      responses:
 *          200:
 *              description: Success
 *              content:
 *                 application/json:
 *                     schema:
 *                        $ref: '#/components/schema/GenreResponse'
 *          400:
 *              description: Genre already exist
 *          401:
 *              description: Unauthorized
 */
genreRoutes.post("/", [roleMiddleware(["ADMIN"])], errorHandler(create));

/***
 * @openapi
 * '/genres/{id}':
 *  put:
 *      tags:
 *      - Genre
 *      summary: Update a genre
 *      description: Only admins can update a genre
 *      parameters:
 *        - name: id
 *          in: path
 *          description: Genre id
 *          required: true
 *      requestBody:
 *          required: true
 *          content:
 *              application/json:
 *                  schema:
 *                      $ref: '#/components/schema/GenreInput'
 *      responses:
 *          200:
 *              description: Success
 *              content:
 *                 application/json:
 *                     schema:
 *                        $ref: '#/components/schema/GenreResponse'
 *          400:
 *              description: Genre already exist
 *          401:
 *              description: Unauthorized
 */
genreRoutes.put("/:id", [roleMiddleware(["ADMIN"])], errorHandler(update));

/***
 * @openapi
 * '/genres':
 *  get:
 *      tags:
 *      - Genre
 *      summary: Get genres
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
 *                        $ref: '#/components/schema/GenresResponse'
 *          401:
 *              description: Unauthorized
 */
genreRoutes.get("/", errorHandler(list));

/***
 * @openapi
 * '/genres/{id}':
 *  get:
 *      tags:
 *      - Genre
 *      summary: Get genre
 *      parameters:
 *        - name: id
 *          in: path
 *          description: Genre id
 *          required: true
 *      responses:
 *          200:
 *              description: Success
 *              content:
 *                 application/json:
 *                     schema:
 *                        $ref: '#/components/schema/GenreResponse'
 *          401:
 *              description: Unauthorized
 */
genreRoutes.get("/:id", errorHandler(get));

/***
 * @openapi
 * '/genres/{id}':
 *  delete:
 *      tags:
 *      - Genre
 *      summary: Delete genre
 *      description: Only admins can delete a genre
 *      parameters:
 *        - name: id
 *          in: path
 *          description: Genre id
 *          required: true
 *      responses:
 *          200:
 *              description: Success
 *          401:
 *              description: Unauthorized
 */
genreRoutes.delete("/:id", [roleMiddleware(["ADMIN"])], errorHandler(remove));

export default genreRoutes;
