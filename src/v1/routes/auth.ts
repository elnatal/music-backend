import { Router } from "express";
import { auth, getIdToken, me } from "../controllers/auth";
import { errorHandler } from "../../error-handler";
import authMiddleware from "../middlewares/auth";

const authRoutes: Router = Router();

/***
 * @openapi
 * '/auth/get-id-token':
 *  post:
 *      tags:
 *      - Auth
 *      summary: Get firebase idToken using email and password
 *      description: This is only for testing purposes to simulate the login process. In a real-world scenario, this will be handled in client applications.
 *      requestBody:
 *          required: true
 *          content:
 *              application/json:
 *                  schema:
 *                      $ref: '#/components/schema/GetIdTokenInput'
 *      responses:
 *          200:
 *              description: Success
 *              content:
 *                 application/json:
 *                     schema:
 *                        type: object
 *                        properties:
 *                          idToken:
 *                              type: string
 *          401:
 *              description: Unauthorized
 */
authRoutes.post("/get-id-token", errorHandler(getIdToken));

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
