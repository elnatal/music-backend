import { Router } from "express";
import { adminUpdate, list, update } from "../controllers/user";
import { errorHandler } from "../../error-handler";
import roleMiddleware from "../middlewares/role";

const userRoutes: Router = Router();

/***
 * @openapi
 * '/users':
 *  put:
 *      tags:
 *      - User
 *      summary: Update authenticated user profile
 *      requestBody:
 *          required: true
 *          content:
 *              application/json:
 *                  schema:
 *                      $ref: '#/components/schema/UserUpdateInput'
 *      responses:
 *          200:
 *              description: Success
 *              content:
 *                 application/json:
 *                     schema:
 *                        $ref: '#/components/schema/UserResponse'
 *          401:
 *              description: Unauthorized
 */
userRoutes.put("/", errorHandler(update));


/***
 * @openapi
 * '/users/{id}':
 *  put:
 *      tags:
 *      - User
 *      summary: Update user profile
 *      description: Only admins can update user profile
 *      requestBody:
 *          required: true
 *          content:
 *              application/json:
 *                  schema:
 *                      $ref: '#/components/schema/AdminUserUpdateInput'
 *      responses:
 *          200:
 *              description: Success
 *              content:
 *                 application/json:
 *                     schema:
 *                        $ref: '#/components/schema/UserResponse'
 *          400:
 *              description: You cannot change your own account type
 *          401:
 *              description: Unauthorized
 *          404:
 *              description: User not found
 */
userRoutes.put("/:id", [roleMiddleware(["ADMIN"])], errorHandler(adminUpdate));

/***
 * @openapi
 * '/users':
 *  get:
 *      tags:
 *      - User
 *      summary: Get users
 *      parameters:
 *        - in: query
 *          name: limit
 *          schema:
 *            type: integer
 *        - in: query
 *          name: skip
 *          schema:
 *            type: integer
 *      description: Only admins can get list of users
 *      responses:
 *          200:
 *              description: Success
 *              content:
 *                 application/json:
 *                     schema:
 *                        $ref: '#/components/schema/UsersResponse'
 *          401:
 *              description: Unauthorized
 */
userRoutes.get("/", [roleMiddleware(["ADMIN"])], errorHandler(list));

export default userRoutes;
