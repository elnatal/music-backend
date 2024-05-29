import { Router } from "express";
import { auth, me } from "../controllers/auth";
import { errorHandler } from "../../error-handler";
import authMiddleware from "../middlewares/auth";

const authRoutes: Router = Router();

authRoutes.post("/", errorHandler(auth));
authRoutes.get("/me", [authMiddleware], errorHandler(me));

export default authRoutes;
