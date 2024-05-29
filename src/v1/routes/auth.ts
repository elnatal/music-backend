import { Router } from "express";
import { auth, me } from "../controllers/auth";
import { errorHandler } from "../../error-handler";
import authMiddleware from "../middlewares/auth";

const authRoutes: Router = Router();

/***
 * @openapi
 * '/auth':
 *  post:
 *      tags:
 *      - Auth
 *      summary: Authenticate using firebase idToken
 *      requestBody:
 *          required: true
 *          content:
 *              application/json:
 *                  schema:
 *                      $ref: '#/components/schema/AuthInput'
 *      responses:
 *          200:
 *              description: Success
 *              content:
 *                 application/json:
 *                     schema:
 *                        $ref: '#/components/schema/AuthResponse'
 *          401:
 *              description: Unauthorized
 */
authRoutes.post("/", errorHandler(auth));


/***
 * @openapi
 * '/auth/me':
 *  get:
 *      tags:
 *      - Auth
 *      summary: Get authenticated user
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
authRoutes.get("/me", [authMiddleware], errorHandler(me));

export default authRoutes;
